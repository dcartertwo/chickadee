import { type Context, type Env, Hono } from "hono";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Column } from "../lib/datapoint";
import { escapeSql } from "../lib/sql";

const app = new Hono<Env>();

// auth
app.use((c, next) =>
  basicAuth({
    username: c.env.BASIC_USERNAME,
    password: c.env.BASIC_PASSWORD,
  })(c, next)
);

// cors
app.use(
  // TODO! how to cors for dashboard?
  cors({
    origin: "*", // allow all origins
    allowMethods: ["OPTIONS", "GET", "POST"],
  })
);

// debug
app.get("/debug", async (c) => {
  const res = await query(
    c.env,
    "SELECT * FROM chickadee ORDER BY timestamp DESC LIMIT 10"
  );
  return c.json(res);
});

// get stats for dashboard
app.get(
  "/:sid",
  zValidator(
    "param",
    z.object({
      sid: z
        .string()
        .toLowerCase()
        .regex(/^[a-z0-9.-]+$/),
    })
  ),
  async (c) => {
    const { sid } = c.req.valid("param");
    try {
      return c.json(await getStats(c, sid));
    } catch (err) {
      console.error("getStats - Error:", err);
      return c.text("Internal Server Error", 500);
    }
  }
);

// helpers

type Timeframe = "today" | "yesterday" | "7d" | "30d" | "90d";
type Granularity = "month" | "week" | "day" | "hour";

function getTimeframeInterval(timeframe: Timeframe): string {
  switch (timeframe) {
    case "today":
      return "'1' DAY";
    case "yesterday":
      return "'2' DAY";
    case "7d":
      return "'7' DAY";
    case "30d":
      return "'30' DAY";
    case "90d":
      return "'90' DAY";
    default:
      throw new Error(`Invalid timeframe: ${timeframe}`);
  }
}

function getGranularityInterval(granularity: Granularity): string {
  switch (granularity) {
    case "month":
      return "'1' MONTH";
    case "week":
      return "'1' WEEK";
    case "day":
      return "'1' DAY";
    case "hour":
      return "'1' HOUR";
    default:
      throw new Error(`Invalid granularity: ${granularity}`);
  }
}

// TODO! dimensions: ref, UTM, path, country, region, city, timezone, browser, os, device, locale
// TODO metrics: width, loadTime

// TODO! filter stats by dimensions

const ZStat = z.object({
  timestamp: z.coerce.date(),
  views: z.coerce.number(),
  visitors: z.coerce.number(),
});
type IStat = z.infer<typeof ZStat>;

async function getStats(
  c: Context<Env>,
  sid: string,
  timeframe: Timeframe = "7d",
  granularity: Granularity = "day"
): Promise<IStat[]> {
  const interval = getTimeframeInterval(timeframe);
  const group = getGranularityInterval(granularity);

  const { data } = await query(
    c.env,
    `
    SELECT
      toStartOfInterval(timestamp, INTERVAL ${group}) as timestamp,
      sum(_sample_interval) as views,
      count(DISTINCT ${Column.dailyVisitorHash}) as visitors
    FROM chickadee
    WHERE
      ${Column.sid} = '${escapeSql(sid)}' AND
      ${Column.evt} = 'view' AND
      timestamp > now() - INTERVAL ${interval}
    GROUP BY timestamp
    ORDER BY timestamp ASC
    `,
    ZStat
  );
  console.debug("getStats - data:", data);
  return data;
}

function createQueryResultSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    meta: z
      .object({
        name: z.string(),
        type: z.string(),
      })
      .array(),
    data: z.array(dataSchema),
    rows: z.number(),
    rows_before_limit_at_least: z.number().optional(),
  });
}

async function query<T extends z.ZodTypeAny>(
  env: Pick<Env["Bindings"], "ACCOUNT_ID" | "API_TOKEN">,
  query: string,
  dataSchema?: T
) {
  console.debug("query()", query);

  const ep = `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/analytics_engine/sql`;
  const res = await fetch(ep, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.API_TOKEN}`,
    },
    body: query,
  });

  // handle error
  if (!res.ok) {
    throw new Error(await res.text());
  }

  // return data
  const result = await res.json();
  console.debug("query ->", result);
  const parsed = createQueryResultSchema(dataSchema ?? z.any()).parse(result);
  return parsed;
}

export default app;
