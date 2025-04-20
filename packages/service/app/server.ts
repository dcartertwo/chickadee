import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { createApp } from "honox/server";
import api from "./api";

const app = createApp();

// logger
app.use(logger());

// serve the api
app.route("/api", api);

// serve the dashboard - should be last
showRoutes(app);

export default app;
