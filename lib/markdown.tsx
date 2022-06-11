import { unified } from "unified";
import markdown from "remark-parse";
import breaks from "remark-breaks";
import remark2rehype from "remark-rehype";
import externalLinks from "rehype-external-links";
import slug from "rehype-slug";
import imgSize from "rehype-img-size";
import picture from "rehype-picture";
import highlight from "rehype-highlight";
import stringify from "rehype-stringify";
import groovy from "highlight.js/lib/languages/groovy";

export const getHtmlFromMarkdown = async (md: string) => {
  const file = await unified()
    .use(markdown)
    .use(breaks)
    .use(remark2rehype, { allowDangerousHtml: false })
    .use(externalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(slug)
    .use(imgSize, { dir: "public" })
    .use(picture, {
      jpg: {
        avif: "image/avif",
        webp: "image/webp",
      },
      png: {
        avif: "image/avif",
        webp: "image/webp",
      },
    })
    .use(highlight, { languages: { groovy } })
    .use(stringify)
    .process(md);

  return file.toString();
};
