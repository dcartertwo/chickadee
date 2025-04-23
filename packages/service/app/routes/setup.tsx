import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
  const script = `<script src="https://[WORKER_DOMAIN].workers.dev/script.js" data-domain="[YOUR_DOMAIN]" />`;
  return c.render(
    <article class="prose prose-lg text-center max-w-full">
      <h1>Setup a Site</h1>
      <p>
        Enter the domain or subdomain you'd like to add and add the following
        script to your website:
      </p>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Site Identifier (sid)</legend>
        <label class="input">
          <span class="icon-[carbon--link] scale-150" />
          <input
            name="sid"
            type="text"
            class="grow"
            placeholder="chickadee.me"
          />
        </label>
        <p class="label">only letters, </p>
      </fieldset>

      <pre>{script}</pre>

      <a href="/setup" class="btn btn-primary btn-xl btn-wide">
        Setup
      </a>
    </article>,
    { class: "justify-center items-center" },
  );
});
