import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { mdToHtml } from "./markdown";

const rootDirectory = path.join(process.cwd(), "content");

export interface RootData {
  id: string;
  title: string;
  contentHtml: string;
}

export async function getRootPageData(id: string) {
  const fullPath = path.join(rootDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const contentHtml = await mdToHtml(matterResult.content);

  return {
    id,
    contentHtml,
    ...(matterResult.data as {
      title: string;
    }),
  } as RootData;
}
