import { createRoute } from "honox/factory";
import Counter from "../islands/counter";

export default createRoute((c) => {
  const name = c.req.query("name") ?? "Hono";
  return c.render(
    <div class="py-8 text-center">
      <title>{name}</title>
      <h1 class="text-3xl font-bold">Hello, {name}!</h1>
      <Counter />
    </div>,

    // TODO! this

    // <div class="h-dvh flex flex-col">
    //   <Header />

    //   <main class="flex-grow flex flex-col p-4 lg:p-8">
    //     <article class="prose lg:prose-xl">
    //       <h1>Hello!</h1>
    //     </article>

    //     <Stats />

    //     <Timeline />
    //   </main>

    //   <Footer />
    // </div>
  );
});
