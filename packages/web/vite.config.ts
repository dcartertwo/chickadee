import devServer from "@hono/vite-dev-server";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    devServer({
      entry: "src/index.tsx",
    }),
    ssg(),
    tailwindcss(),
  ],
});
