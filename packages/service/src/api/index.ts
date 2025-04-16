import { Hono } from "hono";
import type { Env } from "..";
import events from "./events";
import stats from "./stats";

const app = new Hono<Env>();

// log events
app.route("/events", events);

// get stats for dashboard
app.route("/stats", stats);

export default app;
