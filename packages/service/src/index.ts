import { Hono, type Env as HonoEnv } from "hono";
import dashboard from "./dashboard";
import api from "./api";

interface Variables {
  CLOUDFLARE_API_TOKEN: string;
}

export interface Bindings {
  ENVIRONMENT: "development" | "production";

  // Bindings
  ENGINE: AnalyticsEngineDataset;
}

export interface Env extends HonoEnv {
  Bindings: Bindings;
  Variables: Variables;
}

const app = new Hono<Env>();

// serve the dashboard
app.route("/", dashboard);

// serve the api
app.route("/api", api);

export default app;
