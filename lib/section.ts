import path from "path";
import fs from "fs-extra";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface SectionData {
  id: string;
  title: string;
  content: string;
}

export async function getSectionIds() {
  const fileNames = await fs.readdir(contentDirectory, { withFileTypes: true });
  return fileNames
    .filter((f) => f.isFile())
    .map((file) => file.name.replace(/\.md?$/, ""));
}

export async function getSectionById(id: string) {
  const fullPath = path.join(contentDirectory, `${id}.md`);
  const fileContent = await fs.readFile(fullPath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    id,
    ...data,
    content,
  } as SectionData;
}
