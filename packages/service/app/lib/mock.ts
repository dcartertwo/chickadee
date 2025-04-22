import type { IStats, ITimeline } from "./db";

export function getStatsMock(): IStats {
  return {
    visitors: 756,
    visitorsGrowth: 12.5,
    views: 3254,
    viewsGrowth: 8.2,
  };
}

export function getTimelineMock(): ITimeline {
  return [
    { timestamp: new Date("2023-05-25"), visitors: 125, views: 342 },
    { timestamp: new Date("2023-05-26"), visitors: 143, views: 389 },
    { timestamp: new Date("2023-05-27"), visitors: 98, views: 267 },
    { timestamp: new Date("2023-05-28"), visitors: 87, views: 231 },
    { timestamp: new Date("2023-05-29"), visitors: 156, views: 412 },
    { timestamp: new Date("2023-05-30"), visitors: 178, views: 467 },
    { timestamp: new Date("2023-05-31"), visitors: 164, views: 432 },
  ];
}
