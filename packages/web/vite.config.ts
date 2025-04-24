import honox from "honox/vite";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import client from "honox/vite/client";

const entry = "./app/server.ts";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [client({ input: ["/app/style.css"] }), tailwindcss()],
    };
  }
  return {
    build: {
      emptyOutDir: false,
    },
    plugins: [
      honox(),
      ssg({ entry }),
      mode === "development" ? tailwindcss() : null,
    ],
  };
});
