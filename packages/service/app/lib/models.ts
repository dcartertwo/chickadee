import { z } from "zod";

export enum Metric {
  Visitors = "visitors",
  Pageviews = "pageviews",
}

// site
export const ZSid = z
  .string()
  .toLowerCase()
  .regex(/^[a-z0-9.-]+$/, {
    message: "Only letters, numbers, dots, and hyphens are allowed.",
  });

// settings
export const TIMEFRAMES = ["today", "yesterday", "7d", "30d", "90d"] as const;
export const ZTimeframe = z.enum(TIMEFRAMES).default("7d");
export type ITimeframe = z.infer<typeof ZTimeframe>;
export const ZGranularity = z.enum(["month", "week", "day", "hour"]);
export type IGranularity = z.infer<typeof ZGranularity>;

// stats
export const ZStats = z.object({
  visitors: z.coerce.number(),
  visitorsGrowth: z.coerce.number().optional(),
  views: z.coerce.number(),
  viewsGrowth: z.coerce.number().optional(),
});
export type IStats = z.infer<typeof ZStats>;

// timeline
export const ZTimelineItem = z.object({
  timestamp: z.string().transform((str) => new Date(`${str}Z`)), // Ensure UTC parsing by appending Z
  views: z.coerce.number(),
  visitors: z.coerce.number(),
});
const ZTimeline = ZTimelineItem.array();
export type ITimeline = z.infer<typeof ZTimeline>;

// dimensions
export const ZDimension = z.object({
  path: z.string(),
});
export type IDimension = z.infer<typeof ZDimension>;
