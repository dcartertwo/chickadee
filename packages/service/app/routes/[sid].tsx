import { createRoute } from "honox/factory";
import { Footer, Header } from "../components/common";
import Timeline from "../islands/timeline";
import Menu from "../components/menu";
import Stats from "../components/stats";
import { zValidator } from "@hono/zod-validator";
import { ZTimeframe } from "../lib/db";
import { z } from "zod";

export default createRoute(
  zValidator("query", z.object({ tf: ZTimeframe })),
  async (c) => {
    const sid = c.req.param("sid");
    const { tf } = c.req.valid("query");

    // TODO! check if sid exists, otherwise go to index

    return c.render(
      <div class="h-dvh flex flex-col">
        <Header />

        <main class="flex-grow flex flex-col p-4 lg:p-8">
          <Menu sid={sid} tf={tf} />
          <Stats sid={sid} />
          <Timeline sid={sid} />
        </main>

        <Footer />
      </div>,
    );
  },
);
