import { Hono } from "hono";
import { renderer } from "./renderer";
import { basicAuth } from "hono/basic-auth";
import type { Env } from "..";
import { Footer, Header, Stats } from "./common";
import { Timeline } from "../islands/timeline";

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
    <div class="h-dvh flex flex-col">
      <Header />

      <main class="flex-grow flex flex-col p-4 lg:p-8">
        <article class="prose lg:prose-xl">
          <h1>Hello!</h1>
        </article>

        <Stats />

        {/* <Timeline /> */}
        <div id="timeline" />
      </main>

      <Footer />
    </div>,
  );
});

export default app;
