import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <link
          href={import.meta.env.PROD ? "/assets/style.css" : "/src/style.css"}
          rel="stylesheet"
        />

        <script
          src={import.meta.env.PROD ? "/assets/script.js" : "/src/script.js"}
        />
      </head>
      <body>{children}</body>
    </html>
  );
});
