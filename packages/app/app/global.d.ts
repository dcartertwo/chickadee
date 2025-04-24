import "hono";

declare module "hono" {
  interface Env {
    Variables: object;
    Bindings: {
      ENVIRONMENT: "development" | "production";
      // Auth
      BASIC_USERNAME: string;
      BASIC_PASSWORD: string;
      // Cloudflare
      ENGINE_DATASET: string;
      ACCOUNT_ID: string;
      API_TOKEN: string;

      // Bindings
      ENGINE?: AnalyticsEngineDataset;
      KV: KVNamespace;
    };
  }
}
