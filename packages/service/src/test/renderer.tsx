import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <link
          href={import.meta.env.PROD ? "/assets/style.css" : "/src/style.css"}
          rel="stylesheet"
        />

        {/* Chickadee Analytics */}
        <script src="/script.js" />
      </head>
      <body>{children}</body>
    </html>
  );
});
