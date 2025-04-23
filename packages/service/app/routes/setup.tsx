import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
  const script = `<script src="https://[WORKER_DOMAIN].workers.dev/script.js" data-domain="[YOUR_DOMAIN]" />`;
  return c.render(
    <article class="prose prose-lg text-center max-w-full">
      <h1>Setup a Site</h1>
      <p>
        Enter the domain you'd like to add and add the following script to your
        website:
      </p>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Add Site</legend>
        <label class="input">
          <span class="icon-[carbon--link] scale-150" />
          <input type="text" class="grow" placeholder="index.php" />
        </label>

        <p class="label">Optional</p>
      </fieldset>

      <pre class="break-all">{script}</pre>

      <a href="/setup" class="btn btn-primary btn-xl btn-wide">
        Setup
      </a>
    </article>,
    { class: "justify-center items-center" },
  );
});
