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
    allowMethods: ["GET"],
  })
);

app.get("/", (c) => {
  return c.text("Hello API :)");
});

app.get(
  "/events",
  zValidator("query", z.object({ d: z.string() })),
  async (c) => {
    const { d: domain } = c.req.valid("query");
    console.debug("DEBUG query", { domain });

    // HonoRequest: https://hono.dev/docs/api/request
    const headers = c.req.header();
    console.debug("DEBUG headers", headers);
    const host = c.req.header("Host");
    const origin = c.req.header("Origin");
    const referer = c.req.header("Referer");
    const userAgent = c.req.header("User-Agent");
    // TODO! parse userAgent
    console.debug("DEBUG HonoRequest", { host, origin, referer, userAgent });

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
    console.debug("DEBUG conninfo", { ip });

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
