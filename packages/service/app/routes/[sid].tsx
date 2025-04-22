import { createRoute } from "honox/factory";
import { Footer, Header } from "../components/common";
import Menu from "../components/menu";
import { zValidator } from "@hono/zod-validator";
import {
  getDefaultGranularityIntervalForTimeframe,
  getStats,
  getTimeline,
  ZTimeframe,
} from "../lib/db";
import { z } from "zod";
import Dashboard from "../islands/dashboard";
// import { getStatsMock, getTimelineMock } from "../lib/mock";

export default createRoute(
  zValidator("query", z.object({ tf: ZTimeframe })),
  async (c) => {
    const sid = c.req.param("sid");
    const { tf } = c.req.valid("query");

    // get data
    const granularity = getDefaultGranularityIntervalForTimeframe(tf);
    const stats = await getStats(c, sid, tf);
    const timeline = await getTimeline(c, sid, tf, granularity);
    // DEBUG
    // const stats = getStatsMock();
    // const timeline = getTimelineMock();

    return c.render(
      <div class="h-dvh flex flex-col">
        <Header />

        <main class="flex-grow flex flex-col p-4 lg:p-8 bg-base-200">
          <Menu sid={sid} tf={tf} />
          <Dashboard
            tf={tf}
            granularity={granularity}
            stats={stats}
            timeline={timeline}
          />
        </main>

        <Footer />
      </div>,
    );
  },
);
