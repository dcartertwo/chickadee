import type { Context, Env } from "hono";
import { z } from "zod";
import { Column } from "../lib/datapoint";
import { escapeSql } from "../lib/sql";

// * Query

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

export async function query<T extends z.ZodTypeAny>(
  env: Pick<Env["Bindings"], "ACCOUNT_ID" | "API_TOKEN">,
  query: string,
  dataSchema: T
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
  const parsed = createQueryResultSchema(dataSchema).parse(result);
  return parsed;
}

// * Helpers

export const TIMEFRAMES = ["today", "yesterday", "7d", "30d", "90d"] as const;
export const ZTimeframe = z.enum(TIMEFRAMES).default("7d");
export type ITimeframe = z.infer<typeof ZTimeframe>;

export const ZGranularity = z.enum(["month", "week", "day", "hour"]);
export type IGranularity = z.infer<typeof ZGranularity>;

function getTimeframeInterval(tf: ITimeframe): string {
  switch (tf) {
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
      throw new Error(`Invalid timeframe: ${tf}`);
  }
}

export function getDefaultGranularityIntervalForTimeframe(
  tf: ITimeframe
): IGranularity {
  switch (tf) {
    case "today":
      return "hour";
    case "yesterday":
      return "hour";
    case "7d":
      return "day";
    case "30d":
      return "day";
    case "90d":
      return "week";
    default:
      throw new Error(`Invalid timeframe: ${tf}`);
  }
}

function getGranularityInterval(g: IGranularity): string {
  switch (g) {
    case "month":
      return "'1' MONTH";
    case "week":
      return "'1' WEEK";
    case "day":
      return "'1' DAY";
    case "hour":
      return "'1' HOUR";
    default:
      throw new Error(`Invalid granularity: ${g}`);
  }
}

// * Stats

const ZStats = z.object({
  visitors: z.coerce.number(),
  visitorsGrowth: z.coerce.number().optional(),
  views: z.coerce.number(),
  viewsGrowth: z.coerce.number().optional(),
});
export type IStats = z.infer<typeof ZStats>;

export async function getStats(c: Context<Env>, sid: string, tf: ITimeframe) {
  const interval = getTimeframeInterval(tf);

  // TODO include percentage growth since last period
  const { data } = await query(
    c.env,
    `
    SELECT
      sum(_sample_interval) as views,
      count(DISTINCT ${Column.dailyVisitorHash}) as visitors
    FROM chickadee
    WHERE
      ${Column.sid} = ${escapeSql(sid)} AND
      ${Column.evt} = 'view' AND
      timestamp > now() - INTERVAL ${interval}
    `,
    ZStats
  );
  return data.length > 0 ? data[0] : null;
}

// * Timeline

// TODO! fill timeline x-axis with empty values

const ZTimelineItem = z.object({
  timestamp: z.coerce.date(),
  views: z.coerce.number(),
  visitors: z.coerce.number(),
});
const ZTimeline = ZTimelineItem.array();
export type ITimeline = z.infer<typeof ZTimeline>;

export async function getTimeline(
  c: Context<Env>,
  sid: string,
  tf: ITimeframe,
  g: IGranularity
) {
  const interval = getTimeframeInterval(tf);
  const group = getGranularityInterval(g);

  const { data } = await query(
    c.env,
    `
    SELECT
      toStartOfInterval(timestamp, INTERVAL ${group}) as timestamp,
      sum(_sample_interval) as views,
      count(DISTINCT ${Column.dailyVisitorHash}) as visitors
    FROM chickadee
    WHERE
      ${Column.sid} = ${escapeSql(sid)} AND
      ${Column.evt} = 'view' AND
      timestamp > now() - INTERVAL ${interval}
    GROUP BY timestamp
    ORDER BY timestamp ASC
    `,
    ZTimelineItem
  );
  return data;
}

// * TODOs

// TODO! dimensions: ref, UTM, path, country, region, city, timezone, browser, os, device, locale
// TODO metrics: width, loadTime

// TODO! filter by dimensions
