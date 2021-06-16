import "@primer/css/dist/base.css";
import "@primer/css/dist/markdown.css";
import "styles/index.css";
import "styles/markdown.css";
import { useEffect } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { DefaultSeo } from "next-seo";
import { MDXProvider, MDXProviderComponentsProp } from "@mdx-js/react";
import Code from "components/Code";
import Post from "components/Post";
import * as gtag from "lib/gtag";
import { siteDescription, siteName } from "lib/meta";

/* eslint-disable react/display-name */
const components: MDXProviderComponentsProp = {
  wrapper: Post,
  code: Code,
  a: (props) =>
    props.src?.startsWith("/") ? (
      <a {...props} />
    ) : (
      <a target="_blank" rel="noopener noreferrer" {...props} />
    ),
  img: (props) => (
    <div className="my-4">
      <Image layout="responsive" alt="" {...props} />
    </div>
  ),
};
/* eslint-enable react/display-name */

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

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
        <meta name="theme-color" content="#ffffff" />
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
        description={siteDescription}
        twitter={{
          cardType: "summary",
          site: "@robert_ying",
        }}
        openGraph={{
          url: "https://robertying.io/",
          type: "website",
          images: [
            {
              url: "https://og-image.now.sh/Blog%20by%20**Rui%20Ying**.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Frobertying%2Fblog%40master%2Fpublic%2Fandroid-chrome-512x512.png",
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
