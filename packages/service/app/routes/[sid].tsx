import { createRoute } from "honox/factory";
import { Footer, Header } from "../components/common";
import Timeline from "../components/timeline";
import Menu from "../components/menu";
import Stats from "../components/stats";
import { zValidator } from "@hono/zod-validator";
import {
  getDefaultGranularityIntervalForTimeframe,
  getStats,
  getTimeline,
  ZTimeframe,
} from "../lib/db";
import { z } from "zod";

export default createRoute(
  zValidator("query", z.object({ tf: ZTimeframe })),
  async (c) => {
    const sid = c.req.param("sid");
    const { tf } = c.req.valid("query");

    const granularity = getDefaultGranularityIntervalForTimeframe(tf);
    const [stats, timeline] = await Promise.all([
      getStats(c, sid, tf),
      getTimeline(c, sid, tf, granularity),
    ]);

    return c.render(
      <div class="h-dvh flex flex-col">
        <Header />

        <main class="flex-grow flex flex-col p-4 lg:p-8">
          <Menu sid={sid} tf={tf} />
          <Stats stats={stats} />
          <Timeline timeline={timeline} granularity={granularity} />
        </main>

        <Footer />
      </div>,
    );
  },
);
