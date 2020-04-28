import remark from "remark";
import html from "remark-html";
import highlight from "remark-highlight.js";

export async function mdToHtml(md: string) {
  const processedContent = await remark().use(highlight).use(html).process(md);
  return processedContent.toString();
}
