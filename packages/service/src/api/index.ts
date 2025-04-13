import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "..";

const app = new Hono<Env>();

app.get("/", (c) => {
  return c.text("Hello API :)");
});

app.post(
  "/events",
  // TODO! schema
  zValidator(
    "json",
    z.object({
      event: z.string(),
      data: z.object({
        id: z.string(),
        name: z.string(),
      }),
    })
  ),
  async (c) => {
    const body = await c.req.json();

    c.env.ENGINE.writeDataPoint({
      indexes: [],
      blobs: [],
      doubles: [],
    });

    console.log(body);
    return c.text("ok", 200);
  }
);

export default app;
