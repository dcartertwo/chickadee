import { Hono } from "hono";
import { renderer } from "./renderer";
import { basicAuth } from "hono/basic-auth";
import type { Env } from "..";

const app = new Hono<Env>();

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
    <article class="prose lg:prose-xl">
      <h1>Hello!</h1>
    </article>,
  );
});

export default app;
