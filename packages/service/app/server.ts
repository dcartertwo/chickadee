import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { createApp } from "honox/server";
import api from "./api";
import { basicAuth } from "hono/basic-auth";

const app = createApp();

// logger
app.use(logger());

// serve the api
app.route("/api", api);

// serve the dashboard - should be last
app.use((c, next) =>
  basicAuth({
    username: c.env.BASIC_USERNAME,
    password: c.env.BASIC_PASSWORD,
  })(c, next)
);
showRoutes(app);

export default app;
