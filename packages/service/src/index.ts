import { Hono, type Env as HonoEnv } from "hono";
import dashboard from "./dashboard";
import api from "./api";
import test from "./test";
import { logger } from "hono/logger";

type Variables = object;

export interface Bindings {
  ENVIRONMENT: "development" | "production";
  // Auth
  BASIC_USERNAME: string;
  BASIC_PASSWORD: string;
  // Cloudflare
  CLOUDFLARE_API_TOKEN: string;

  // Bindings
  ENGINE?: AnalyticsEngineDataset;
}

export interface Env extends HonoEnv {
  Bindings: Bindings;
  Variables: Variables;
}

const app = new Hono<Env>();

// logger
app.use(logger());

// serve the api
app.route("/api", api);

// serve the test page
app.route("/test", test);

// serve the dashboard - should be last
app.route("/", dashboard);

export default app;
