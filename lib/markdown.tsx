import * as prod from "react/jsx-runtime";
import { unified } from "unified";
import markdown from "remark-parse";
import breaks from "remark-breaks";
import remark2rehype from "remark-rehype";
import slug from "rehype-slug";
import imgSize from "rehype-img-size";
import highlight from "rehype-highlight";
import { common } from "lowlight";
import groovy from "highlight.js/lib/languages/groovy";
import react, { Components } from "rehype-react";
import Image from "next/image";
import Link from "next/link";
import isAbsoluteUrl from "is-absolute-url";

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

const components = {
  img: (props) => <Image {...(props as any)} alt={props.alt!} />,
  a: (props) =>
    props.href && isAbsoluteUrl(props.href) ? (
      <Link {...(props as any)} target="_blank" rel="noopener noreferrer" />
    ) : (
      <Link {...(props as any)} />
    ),
} as Components;

export const getReactElementFromMarkdown = async (md: string) => {
  const file = await unified()
    .use(markdown)
    .use(breaks)
    .use(remark2rehype, { allowDangerousHtml: false })
    .use(slug)
    .use(imgSize, { dir: "public" })
    .use(highlight, { detect: true, languages: { ...common, groovy } })
    .use(react, {
      ...production,
      components,
    } as any)
    .process(md);

  return file.result;
};
