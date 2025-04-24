import type { Child, FC } from "hono/jsx";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

const BaseLayout: FC<{ children: Child }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Chickadee Analytics</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />

        <script
          defer
          src="https://chickadee-demo.5sides.workers.dev/script.js"
          data-domain="chickadee.me"
        />
      </head>
      <body>{children}</body>
    </html>
  );
};

const LandingLayout: FC<{ children: Child; class?: string }> = ({
  children,
}) => {
  return (
    <BaseLayout>
      <Header />

      <main class="flex-grow flex flex-col p-4 lg:p-8 gap-4">{children}</main>

      <Footer />
    </BaseLayout>
  );
};

export const Header: FC = () => {
  return (
    <div class="navbar shadow-sm bg-base-200">
      <a class="btn btn-ghost text-xl" href="/">
        🐦 Chickadee Analytics
      </a>
    </div>
  );
};

export const Footer: FC = () => {
  const url = "https://github.com/abegehr/chickadee";

  return (
    <footer class="footer sm:footer-horizontal footer-center text-base-content p-4 bg-base-200">
      <aside>
        <p>
          🐦 Chickadee -{" "}
          <a href={url} class="link">
            abegehr/chickadee
          </a>
        </p>
      </aside>
    </footer>
  );
};

export default jsxRenderer(({ children }) => {
  return <LandingLayout>{children}</LandingLayout>;
});
