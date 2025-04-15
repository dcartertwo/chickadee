import { jsxRenderer } from "hono/jsx-renderer";
declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: <explanation>
    (content: string | Promise<string>, props: { title: string }): Response;
  }
}

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <link
          href={import.meta.env.PROD ? "/assets/style.css" : "/src/style.css"}
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
});
