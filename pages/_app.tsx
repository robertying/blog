import "@primer/css/dist/markdown.css";
import "styles/global.css";
import "styles/markdown.css";
import "styles/scheme.css";
import { useEffect } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import { DefaultSeo } from "next-seo";
import { MDXProvider, MDXProviderProps } from "@mdx-js/react";
import Code from "components/Code";
import Post from "components/Post";
import * as gtag from "lib/gtag";
import { siteName } from "lib/meta";

const components: MDXProviderProps["components"] = {
  wrapper: Post,
  code: Code,
  a: (props) => <a {...props} target="_blank" rel="noreferrer noopener" />,
};

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content={siteName} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <DefaultSeo
        title="Home"
        titleTemplate={`%s | ${siteName}`}
        description="EE undergraduate at Tsinghua University. Incoming CS MS graduate at Stanford University."
        twitter={{
          cardType: "summary",
          site: "@robert_ying",
        }}
        openGraph={{
          url: "https://robertying.io/",
          type: "website",
          images: [
            {
              url:
                "https://og-image.now.sh/Blog%20by%20**Rui%20Ying**.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Frobertying%2Fblog%40master%2Fpublic%2Fandroid-chrome-512x512.png",
            },
          ],
        }}
      />
      <MDXProvider components={components}>
        <Component {...pageProps} />
      </MDXProvider>
    </>
  );
};

export default App;
