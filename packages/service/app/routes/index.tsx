import { createRoute } from "honox/factory";
import { Footer, Header, Stats } from "../components/common";
import Timeline from "../islands/timeline";

export default createRoute((c) => {
  return c.render(
    <div class="h-dvh flex flex-col">
      <Header />

      <main class="flex-grow flex flex-col p-4 lg:p-8">
        <article class="prose lg:prose-xl">
          <h1>Hello!</h1>
        </article>

        <Stats />

        <Timeline />
      </main>

      <Footer />
    </div>,
  );
});
