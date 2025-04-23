import type { Child, FC } from "hono/jsx";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { Footer, Header } from "../components/common";

const BaseLayout: FC<{ children: Child }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Chickadee Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body class="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
};

const DashboardLayout: FC<{ children: Child }> = ({ children }) => {
  return (
    <BaseLayout>
      <Header />

      <main class="flex-grow flex flex-col p-4 lg:p-8">{children}</main>

      <Footer />
    </BaseLayout>
  );
};

export default jsxRenderer(({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
});
