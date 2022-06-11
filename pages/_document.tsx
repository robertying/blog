import { Html, Head, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark_dimmed"
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
