import { type Context, Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "..";
import { cors } from "hono/cors";
import { UAParser } from "ua-parser-js";
import { getConnInfo } from "hono/cloudflare-workers";
import { parseAcceptLanguage } from "intl-parse-accept-language";

// To identify unique visitor count: hash(daily salt + domain + IP + user agent + accept language)
// inspired by: https://plausible.io/data-policy#how-we-count-unique-users-without-cookies

const app = new Hono<Env>();

// cors
app.use(
  cors({
    origin: "*", // allow all origins
    allowMethods: ["OPTIONS", "GET", "POST"],
  })
);

// POST events
app.post(
  "/",
  zValidator(
    "json",
    z.object({
      e: z.string().describe("Event Name").optional().default("view"),
      d: z.string().describe("Domain"),
      u: z.string().url().describe("URL"),
      r: z.string().describe("Referrer").optional(),
      w: z.number().describe("Screen Width in px").optional(),
      t: z.number().describe("Load Time in ms").optional(),
      uid: z.string().describe("User ID").optional(), // TODO allow setting uid (requires consent)
    })
  ),
  async (c) => {
    try {
      // Request Body
      const {
        e: evt,
        d: sid,
        u,
        r: ref,
        w: width,
        t: loadTime,
        uid,
      } = c.req.valid("json");
      const url = new URL(u);

      // HonoRequest: https://hono.dev/docs/api/request
      const acceptLanguage = c.req.header("Accept-Language");
      const locales = acceptLanguage ? parseAcceptLanguage(acceptLanguage) : [];
      const locale = locales.length > 0 ? locales[0] : null;
      const userAgent = c.req.header("User-Agent");
      const ua = userAgent ? UAParser(userAgent) : null;

      // CF Request Properties: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
      const cf = c.req.raw.cf as IncomingRequestCfProperties | undefined;
      // CF Bot Management: https://developers.cloudflare.com/bots/concepts/bot-score/
      const isBot =
        cf &&
        (cf.botManagement.verifiedBot ||
          (cf.botManagement.score > 0 && cf.botManagement.score < 30));

      // Connection Info
      const info = getConnInfo(c);
      const ip = info.remote.address;

      // Daily Visitor Hash
      const salt = await getDailySalt(c);
      const dailyVisitorHash =
        ip && userAgent
          ? await hash([salt, sid, ip, userAgent, acceptLanguage].join(":"))
          : null;

      // Build data point
      const data: IDataPoint = {
        sid,
        evt,
        ref: ref ?? null,
        path: url.pathname,
        hash: url.hash,

        // Location
        country: cf?.country ?? null,
        region: cf?.region ?? null,
        city: cf?.city ?? null,
        timezone: cf?.timezone ?? null,

        // headers
        browser: ua?.browser.name ?? null,
        browserVersion: ua?.browser.version ?? null,
        os: ua?.os.name ?? null,
        osVersion: ua?.os.version ?? null,
        device: ua ? ua.device.type ?? "desktop" : null, // default to desktop: https://github.com/faisalman/ua-parser-js/issues/182
        locale,

        // UTM
        utmSource: url.searchParams.get("utm_source"),
        utmCampaign: url.searchParams.get("utm_campaign"),
        utmMedium: url.searchParams.get("utm_medium"),

        // User
        uid: uid ?? null,
        dailyVisitorHash,

        // Metrics
        width: width ?? null,
        loadTime: loadTime ?? null,

        // Flags
        isBot: isBot ?? null,
      };

      // Write data point to Analytics Engine.
      // * Limits: https://developers.cloudflare.com/analytics/analytics-engine/limits/
      if (c.env.ENGINE)
        c.env.ENGINE.writeDataPoint(toAnalyticsEngineDataPoint(data));
      else console.info("EVENT", data);

      return c.text("ok", 200);
    } catch (err) {
      console.error(err);
      return c.text("Internal Server Error", 500);
    }
  }
);

// Data Point Schema

const ZDataPoint = z.object({
  sid: z.string(), // blob-1
  evt: z.string(), // blob-2
  ref: z.string().nullable(), // blob-3
  path: z.string(), // blob-4
  hash: z.string().nullable(), // blob-5

  // Location
  country: z.string().nullable(), // blob-6
  region: z.string().nullable(), // blob-7
  city: z.string().nullable(), // blob-8
  timezone: z.string().nullable(), // blob-9

  // Headers
  browser: z.string().nullable(), // blob-10
  browserVersion: z.string().nullable(), // blob-11
  os: z.string().nullable(), // blob-12
  osVersion: z.string().nullable(), // blob-13
  device: z.string().nullable(), // blob-14
  locale: z.string().nullable(), // blob-15

  // UTM
  utmSource: z.string().nullable(), // blob-16
  utmCampaign: z.string().nullable(), // blob-17
  utmMedium: z.string().nullable(), // blob-18

  // User
  uid: z.string().nullable(), // blob-19
  dailyVisitorHash: z.string().nullable(), // blob-20

  // Metrics
  width: z.number().nullable(), // double-1
  loadTime: z.number().nullable(), // double-2

  // Flag
  isBot: z.coerce.boolean().nullable(), // double-3
});
type IDataPoint = z.infer<typeof ZDataPoint>;

function toAnalyticsEngineDataPoint(
  data: IDataPoint
): AnalyticsEngineDataPoint {
  // 96 bytes max
  const index = [data.sid.substring(0, 60), data.evt.substring(0, 30)].join(
    ","
  );

  return {
    // max 1 index, 96 bytes
    indexes: [index],
    // max 20 blobs, total 5120 bytes
    blobs: [
      data.sid, // blob-1
      data.evt, // blob-2
      data.ref, // blob-3
      data.path, // blob-4
      data.hash ?? null, // blob-5

      // Location
      data.country ?? null, // blob-6
      data.region ?? null, // blob-7
      data.city ?? null, // blob-8
      data.timezone ?? null, // blob-9

      // Headers
      data.browser ?? null, // blob-10
      data.browserVersion ?? null, // blob-11
      data.os ?? null, // blob-12
      data.osVersion ?? null, // blob-13
      data.device ?? null, // blob-14
      data.locale ?? null, // blob-15

      // UTM
      data.utmSource ?? null, // blob-16
      data.utmCampaign ?? null, // blob-17
      data.utmMedium ?? null, // blob-18

      // User
      data.dailyVisitorHash ?? null, // blob-19
      data.uid ?? null, // blob-20
    ],
    // max 20 doubles
    doubles: [
      // Metrics
      data.width ?? 0, // double-1
      data.loadTime ?? 0, // double-2

      // Flag
      data.isBot ? 1 : 0, // double-3
    ],
  };
}

// helpers

function getMidnight() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

const DAILY_SALT_KEY = "SALT";

async function getDailySalt(c: Context<Env>) {
  const salt = await c.env.KV.get(DAILY_SALT_KEY);
  if (salt) return salt;

  // Generate new salt, expire at end-of-day
  const newSalt = crypto.randomUUID();
  const expiration = Math.floor(getMidnight().getTime() / 1000) + 86400;
  await c.env.KV.put(DAILY_SALT_KEY, newSalt, { expiration });
  return newSalt;
}

async function hash(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    { name: "SHA-256" },
    new TextEncoder().encode(input)
  );
  const text = new TextDecoder().decode(digest);
  return text;
}

// export
export default app;
