import path from "path";
import fs from "fs-extra";
import matter from "gray-matter";
import dayjs from "dayjs";

const postDirectory = path.join(process.cwd(), "content/posts");

export interface PostData {
  id: string;
  date: string;
  title: string;
  description: string;
  content: string;
}

export async function getPostIds() {
  const fileNames = await fs.readdir(postDirectory, { withFileTypes: true });
  return fileNames
    .filter((f) => f.isFile())
    .map((file) => file.name.replace(/\.md?$/, ""));
}

export async function getPostById(id: string) {
  const fullPath = path.join(postDirectory, `${id}.md`);
  const fileContent = await fs.readFile(fullPath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    id,
    ...data,
    content,
  } as PostData;
}

export async function getAllPosts() {
  const postIds = await getPostIds();
  const allPosts = await Promise.all(postIds.map((id) => getPostById(id)));

  allPosts.sort((a, b) => {
    if (dayjs(a.date).isBefore(dayjs(b.date))) {
      return 1;
    } else {
      return -1;
    }
  });

  return allPosts;
}
