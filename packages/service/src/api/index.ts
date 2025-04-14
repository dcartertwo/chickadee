import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "..";
import { cors } from "hono/cors";
import { UAParser } from "ua-parser-js";

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
    z.object({ d: z.string(), u: z.string().url(), r: z.string() })
  ),
  async (c) => {
    try {
      // Request Body
      const { d: domain, u, r: referrer } = c.req.valid("json");
      const url = new URL(u);

      // HonoRequest: https://hono.dev/docs/api/request
      const userAgent = c.req.header("User-Agent");
      const ua = userAgent ? UAParser(userAgent) : undefined;

      // CF Request Properties: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
      const cf = c.req.raw.cf as IncomingRequestCfProperties | undefined;

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
        userAgent,
        browser: ua?.browser.name,
        browserVersion: ua?.browser.version,
        os: ua?.os.name,
        osVersion: ua?.os.version,
        device: ua ? ua.device.type ?? "desktop" : undefined, // default to desktop: https://github.com/faisalman/ua-parser-js/issues/182

        // CF Bot Management: https://developers.cloudflare.com/bots/concepts/bot-score/
        isBot:
          cf &&
          (cf.botManagement.verifiedBot ||
            (cf.botManagement.score > 0 && cf.botManagement.score < 30)),
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
  userAgent: z.string().optional(), // blob-11
  browser: z.string().optional(), // blob-12
  browserVersion: z.string().optional(), // blob-13
  os: z.string().optional(), // blob-14
  osVersion: z.string().optional(), // blob-15
  device: z.string().optional(), // blob-16

  // Flag
  isBot: z.boolean().optional(), // double-1
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
      data.userAgent ?? null, // blob-11
      data.browser ?? null, // blob-12
      data.browserVersion ?? null, // blob-13
      data.os ?? null, // blob-14
      data.osVersion ?? null, // blob-15
      data.device ?? null, // blob-16
    ],
    // max 20 doubles
    doubles: [data.isBot ? 1 : 0], // double-1
  };
}

export default app;
