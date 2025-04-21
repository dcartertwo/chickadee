import { type Env, Hono } from "hono";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getStats, query } from "../lib/db";

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
    "SELECT * FROM chickadee ORDER BY timestamp DESC LIMIT 10",
    z.any()
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

export default app;
