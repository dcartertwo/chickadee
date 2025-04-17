import { Hono } from "hono";
import { renderer } from "./renderer";
import { basicAuth } from "hono/basic-auth";
import type { Env } from "..";

const app = new Hono<Env>();

// auth
app.use((c, next) =>
  basicAuth({
    username: c.env.BASIC_USERNAME,
    password: c.env.BASIC_PASSWORD,
  })(c, next),
);

app.use(renderer);

app.get("/", (c) => {
  // TODO! dashboard
  return c.render(
    <div class="w-full min-h-full flex flex-col">
      <div class="navbar bg-base-100 shadow-sm">
        <a class="btn btn-ghost text-xl" href="/">
          Chickadee
        </a>
      </div>

      <article class="prose lg:prose-xl">
        <h1>Hello!</h1>
      </article>
    </div>,
  );
});

export default app;
