import { type Context, Hono } from "hono";
import type { Bindings, Env } from "..";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import SQLString from "sqlstring";

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
  "/:domain",
  zValidator(
    "param",
    z.object({
      domain: z
        .string()
        .toLowerCase()
        .regex(/^[a-z0-9.-]+$/),
    })
  ),
  async (c) => {
    const { domain } = c.req.valid("param");
    try {
      return c.json(await getStats(c, domain));
    } catch (err) {
      console.error("getStats - Error:", err);
      return c.text("Internal Server Error", 500);
    }
  }
);

// helpers

// TODO! how to query?
async function getStats(c: Context<Env>, domain: string) {
  const data = await query(
    c.env,
    `
    SELECT *
    FROM chickadee
    WHERE
      timestamp > NOW() - INTERVAL '7' DAY AND
      blob1 = ${SQLString.escape(domain)}
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

export default app;
