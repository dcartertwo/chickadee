import { type Context, Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "..";
import { cors } from "hono/cors";
import { UAParser } from "ua-parser-js";
import { getConnInfo } from "hono/cloudflare-workers";
import { parseAcceptLanguage } from "intl-parse-accept-language";

// The Events Endpoint uses these solutions for determining daily visitor count:
// 1. Daily Visitor Hash: hash(daily salt + domain + IP + user agent + language)
//  - https://plausible.io/data-policy#how-we-count-unique-users-without-cookies
// 2. Incrementing Hit Count in Last-Modified Header
//  - https://docs.withcabin.com/#unique-visitors-without-cookies
//  - https://notes.normally.com/cookieless-unique-visitor-counts/
//  - https://github.com/benvinegar/counterscale/blob/v3/packages/server/app/analytics/collect.ts
//  - https://news.ycombinator.com/item?id=33802683

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
  "/events",
  zValidator(
    "json",
    z.object({
      d: z.string().describe("Domain"),
      u: z.string().url().describe("URL"),
      r: z.string().describe("Referrer"),
      w: z.number().describe("Screen Width in px"),
      t: z.number().describe("Load Time in ms"),
    })
  ),
  async (c) => {
    try {
      // Request Body
      const {
        d: domain,
        u,
        r: referrer,
        w: width,
        t: loadTime,
      } = c.req.valid("json");
      const url = new URL(u);

      // HonoRequest: https://hono.dev/docs/api/request
      const acceptLanguage = c.req.header("Accept-Language");
      const locales = acceptLanguage ? parseAcceptLanguage(acceptLanguage) : [];
      const locale = locales.length > 0 ? locales[0] : undefined;
      const userAgent = c.req.header("User-Agent");
      const ua = userAgent ? UAParser(userAgent) : undefined;

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
          ? await hash([salt, domain, ip, userAgent, acceptLanguage].join(":"))
          : undefined;

      // Cache Hit Counter
      console.info("DEBUG All Headers", { headers: c.req.header() }); // DEBUG
      const modifiedSince = c.req.header("If-Modified-Since");
      console.info(`DEBUG modifiedSince "${modifiedSince}"`); // DEBUG
      const date = modifiedSince ? new Date(modifiedSince) : null;
      const midnight = getMidnight();
      const hit = date && isToday(date) ? getTS(date) - getTS(midnight) : 0;
      const newVisitor = hit === 0;
      const bounce = hit === 0 ? 1 : hit === 1 ? -1 : 0;
      const nextDate = new Date(midnight.getTime() + hit * 1000);
      console.info(`DEBUG nextDate "${nextDate.toUTCString()}"`); // DEBUG
      c.header("Cache-Control", "no-cache");
      c.header("Last-Modified", nextDate.toUTCString());

      // Build data point
      const data: IDataPoint = {
        domain,
        host: url.host,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        referrer,

        // Location
        country: cf?.country,
        region: cf?.regionCode,
        city: cf?.city,
        location: `${cf?.latitude},${cf?.longitude}`,
        timezone: cf?.timezone,

        // User Agent
        browser: ua?.browser.name,
        browserVersion: ua?.browser.version,
        os: ua?.os.name,
        osVersion: ua?.os.version,
        device: ua ? ua.device.type ?? "desktop" : undefined, // default to desktop: https://github.com/faisalman/ua-parser-js/issues/182
        locale,

        // Daily Visitor Hash
        dailyVisitorHash,

        // Metrics
        width,
        loadTime,

        // Flags
        isBot,
        newVisitor,
        bounce,
      };

      // Write data point to Analytics Engine.
      // * Limits: https://developers.cloudflare.com/analytics/analytics-engine/limits/
      if (c.env.ENGINE)
        c.env.ENGINE.writeDataPoint(toAnalyticsEngineDataPoint(data));
      else console.info("EVENT", data);

      return c.json({ success: true }, 200);
    } catch (err) {
      console.error(err);
      return c.json({ success: false }, 500);
    }
  }
);

// Data Point Schema

const ZDataPoint = z.object({
  domain: z.string(), // index-1

  // Basic
  host: z.string(), // blob-1
  pathname: z.string(), // blob-2
  search: z.string().optional(), // blob-3
  hash: z.string().optional(), // blob-4
  referrer: z.string(), // blob-5

  // Location
  country: z.string().optional(), // blob-6
  region: z.string().optional(), // blob-7
  city: z.string().optional(), // blob-8
  location: z.string().optional(), // blob-9
  timezone: z.string().optional(), // blob-10

  // User Agent
  browser: z.string().optional(), // blob-11
  browserVersion: z.string().optional(), // blob-12
  os: z.string().optional(), // blob-13
  osVersion: z.string().optional(), // blob-14
  device: z.string().optional(), // blob-15

  // Headers
  locale: z.string().optional(), // blob-16

  // Daily Visitor Hash
  dailyVisitorHash: z.instanceof(ArrayBuffer).optional(), // blob-20

  // Metrics
  width: z.number().optional(), // double-1
  loadTime: z.number().optional(), // double-2

  // Flag
  isBot: z.coerce.boolean().optional(), // double-3
  newVisitor: z.coerce.boolean().optional(), // double-4
  bounce: z.number().min(-1).max(1).optional(), // double-5
});
type IDataPoint = z.infer<typeof ZDataPoint>;

function toAnalyticsEngineDataPoint(
  data: IDataPoint
): AnalyticsEngineDataPoint {
  return {
    // max 1 index, 96 bytes
    indexes: [data.domain],
    // max 20 blobs, total 5120 bytes
    blobs: [
      data.host, // blob-1
      data.pathname, // blob-2
      data.search ?? null, // blob-3
      data.hash ?? null, // blob-4
      data.referrer, // blob-5

      // Location
      data.country ?? null, // blob-6
      data.region ?? null, // blob-7
      data.city ?? null, // blob-8
      data.location ?? null, // blob-9
      data.timezone ?? null, // blob-10

      // User Agent
      data.browser ?? null, // blob-11
      data.browserVersion ?? null, // blob-12
      data.os ?? null, // blob-13
      data.osVersion ?? null, // blob-14
      data.device ?? null, // blob-15

      // Headers
      data.locale ?? null, // blob-16

      // Empty
      null, // blob-17
      null, // blob-18
      null, // blob-19

      // Daily Visitor Hash
      data.dailyVisitorHash ?? null, // blob-20
    ],
    // max 20 doubles
    doubles: [
      // Metrics
      data.width ?? 0, // double-1
      data.loadTime ?? 0, // double-2

      // Flag
      data.isBot ? 1 : 0, // double-3
      data.newVisitor ? 1 : 0, // double-4
      data.bounce ?? 0, // double-5
    ],
  };
}

// helpers - datetime

function getMidnight() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function getTS(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

// helpers - crypto

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

async function hash(input: string) {
  return await crypto.subtle.digest(
    { name: "SHA-256" },
    new TextEncoder().encode(input)
  );
}

// export
export default app;
