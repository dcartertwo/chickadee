import { Hono } from "hono";
import dashboard from "./dashboard";

const app = new Hono();

// serve the dashboard
app.route("/", dashboard);

export default app;
