import type { NotFoundHandler } from "hono";

const handler: NotFoundHandler = (c) => {
  c.status(404);
  return c.render(
    <article class="prose prose-lg">
      <h1>404 Site Not Found</h1>
      <p>Do you want to setup this site?</p>
      <a href="/setup" class="btn btn-primary">
        Setup
      </a>
    </article>,
  );
};

export default handler;
