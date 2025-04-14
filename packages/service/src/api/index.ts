import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "..";
import { getConnInfo } from "hono/cloudflare-workers";
import { cors } from "hono/cors";

const app = new Hono<Env>();

// cors
app.use(
  cors({
    origin: "*",
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "User-Agent"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 600, // 10 minutes
  })
);

app.get("/", (c) => {
  return c.text("Hello API :)");
});

app.post(
  "/events",
  zValidator(
    "json",
    z.object({ d: z.string(), u: z.string().url(), r: z.string() })
  ),
  async (c) => {
    const { d: domain, u, r: referrer } = c.req.valid("json");
    const url = new URL(u);
    const host = url.host;
    const pathname = url.pathname;
    console.debug("DEBUG body", { domain, url, host, pathname, referrer });

    // HonoRequest: https://hono.dev/docs/api/request
    const userAgent = c.req.header("User-Agent");
    // TODO! parse userAgent
    console.debug("DEBUG HonoRequest", { userAgent });

    // CF Request Properties: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
    const cf = c.req.raw.cf as IncomingRequestCfProperties | undefined;
    const country = cf?.country;
    const region = cf?.regionCode;
    const city = cf?.city;
    const latitude = cf?.latitude ? Number.parseFloat(cf?.latitude) : null;
    const longitude = cf?.longitude ? Number.parseFloat(cf?.longitude) : null;
    const timezone = cf?.timezone;
    // CF Bot Management: https://developers.cloudflare.com/bots/concepts/bot-score/
    const isBot =
      cf &&
      (cf.botManagement.verifiedBot ||
        (cf.botManagement.score > 0 && cf.botManagement.score < 30));
    console.debug("DEBUG cf parsed", {
      country,
      region,
      city,
      latitude,
      longitude,
      timezone,
      isBot,
    });

    // Connection Info: https://hono.dev/docs/helpers/conninfo
    const info = getConnInfo(c);
    const ip = info.remote.address;
    console.debug("DEBUG connInfo", { ip });

    // Write event to Analytics Engine.
    // * Limits: https://developers.cloudflare.com/analytics/analytics-engine/limits/
    const event: AnalyticsEngineDataPoint = {
      // max 1 index, 96 bytes
      indexes: [],
      // max 20 blobs, total 5120 bytes
      blobs: [],
      // max 20 doubles
      doubles: [],
    };
    if (c.env.ENGINE) c.env.ENGINE.writeDataPoint(event);
    else console.info("EVENT", event);

    return c.text("ok", 200);
  }
);

export default app;
