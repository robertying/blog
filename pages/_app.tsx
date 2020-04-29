import "highlight.js/styles/github.css";
import "@primer/css/dist/markdown.css";
import "../styles/global.css";
import "../styles/markdown.css";
import "../styles/scheme.css";
import { AppProps } from "next/app";
import Router from "next/router";
import * as gtag from "../lib/gtag";

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url));

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
