import { type Context, Hono } from "hono";
import type { Bindings, Env } from "..";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import SQLString from "sqlstring";
import { Column } from "../lib/datapoint";

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
      return "1 DAY";
    case "yesterday":
      return "2 DAY";
    case "7d":
      return "7 DAY";
    case "30d":
      return "30 DAY";
    case "90d":
      return "90 DAY";
    default:
      throw new Error(`Invalid timeframe: ${timeframe}`);
  }
}

function getGranularityInterval(granularity: Granularity): string {
  switch (granularity) {
    case "month":
      return "1 MONTH";
    case "week":
      return "1 WEEK";
    case "day":
      return "1 DAY";
    case "hour":
      return "1 HOUR";
    default:
      throw new Error(`Invalid granularity: ${granularity}`);
  }
}

async function getStats(
  c: Context<Env>,
  sid: string,
  timeframe: Timeframe = "7d",
  granularity: Granularity = "day"
) {
  const interval = getTimeframeInterval(timeframe);
  const group = getGranularityInterval(granularity);

  const data = await query(
    c.env,
    `
    SELECT
      toStartOfInterval(timestamp, INTERVAL '${group}') as timestamp,
      sum(_sample_interval) as views,
      count(DISTINCT ${Column.index}) as unique_visitors
    FROM chickadee
    WHERE
      ${Column.sid} = ${SQLString.escape(sid)} AND
      ${Column.evt} = 'view' AND
      timestamp > now() - INTERVAL '${interval}'
    GROUP BY timestamp
    ORDER BY timestamp DESC
    `
  );
  console.debug("getStats - data:", data);
  return { data };
}

async function query(
  env: Pick<Bindings, "ACCOUNT_ID" | "API_TOKEN">,
  query: string
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
  const data = await res.json();
  console.debug("query ->", data);
  return data;
}
