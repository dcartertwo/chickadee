import { Fragment } from "hono/jsx/jsx-runtime";
import { createRoute } from "honox/factory";
import { ZSid } from "../lib/models";

export const POST = createRoute(async (c) => {
  const body = await c.req.parseBody();
  const parsed = ZSid.safeParse(body.sid);

  // parsing failed
  if (!parsed.success) {
    const error = parsed.error.format()._errors.join(" ");
    return c.render(
      <article class="prose prose-lg text-center max-w-full">
        <h1>Invalid Site Identifier</h1>
        <pre>{body.sid}</pre>
        <p class="text-error">{error}</p>
        <a href="/setup" class="btn btn-primary btn-xl btn-wide">
          Back
        </a>
      </article>,
      { class: "justify-center items-center" },
    );
  }

  const sid = parsed.data;
  console.debug("DEBUG new sid", sid); // TODO! add sid to kv
  const script = `
<script
  src="https://[WORKER_DOMAIN].workers.dev/script.js"
  data-domain="${sid}"
></script>`;
  return c.render(
    <article class="prose prose-lg text-center max-w-full">
      <h1>Setup Complete</h1>
      <p>Add the following script to your website:</p>
      <pre class="text-start">{script}</pre>
      <a href={`/${sid}`} class="btn btn-primary btn-xl btn-wide">
        Go to site
      </a>
    </article>,
    { class: "justify-center items-center" },
  );
});

export default createRoute(async (c) => {
  return c.render(
    <Fragment>
      <article class="prose prose-lg text-center max-w-full">
        <h1>Setup a Site</h1>
        <p>Enter the domain or subdomain you'd like to add.</p>
      </article>

      <form
        class="flex flex-col gap-4 max-w-xs items-center w-full"
        method="post"
      >
        <label class="input">
          <span class="icon-[carbon--link] scale-150" />
          <input
            name="sid"
            type="text"
            class="grow"
            placeholder="chickadee.me"
          />
        </label>
        <p class="label text-xs">letters, numbers, dots, and hyphens</p>

        <button type="submit" class="btn btn-primary btn-xl btn-wide">
          Setup
        </button>
      </form>
    </Fragment>,
    { class: "justify-center items-center" },
  );
});
