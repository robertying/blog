import { unified } from "unified";
import markdown from "remark-parse";
import breaks from "remark-breaks";
import remark2rehype from "remark-rehype";
import slug from "rehype-slug";
import imgSize from "rehype-img-size";
import highlight from "rehype-highlight";
import groovy from "highlight.js/lib/languages/groovy";
import { Fragment, createElement } from "react";
import react from "rehype-react";
import Image from "next/image";
import Link from "next/link";
import isAbsoluteUrl from "is-absolute-url";

export const getReactElementFromMarkdown = async (md: string) => {
  const file = await unified()
    .use(markdown)
    .use(breaks)
    .use(remark2rehype, { allowDangerousHtml: false })
    .use(slug)
    .use(imgSize, { dir: "public" })
    .use(highlight, { languages: { groovy } })
    .use(react, {
      createElement: createElement,
      Fragment: Fragment,
      components: {
        img: (props: any) => <Image {...props} alt={props.alt!} />,
        a: (props: any) =>
          isAbsoluteUrl(props.href) ? (
            <Link {...props} target="_blank" rel="noopener noreferrer" />
          ) : (
            <Link {...props} />
          ),
      },
    })
    .process(md);

  return file.result;
};
