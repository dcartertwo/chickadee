import type { Context, Env } from "hono";

// * Sites

export async function getSites(c: Context<Env>) {
  return (await c.env.KV.get("sites"))?.split(",") ?? [];
}
