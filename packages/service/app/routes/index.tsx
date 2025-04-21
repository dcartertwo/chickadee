import { createRoute } from "honox/factory";
import { Footer, Header } from "../components/common";
import Timeline from "../islands/timeline";
import Menu from "../components/menu";
import Stats from "../components/stats";

export default createRoute((c) => {
  return c.render(
    <div class="h-dvh flex flex-col">
      <Header />

      <main class="flex-grow flex flex-col p-4 lg:p-8">
        <Menu />

        <Stats />

        <Timeline />
      </main>

      <Footer />
    </div>,
  );
});
