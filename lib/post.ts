import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "pages/posts");

export interface PostData {
  id: string;
  date: string;
  title: string;
  description: string;
}

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf-8");

    const { data } = matter(fileContent);

    return {
      id,
      ...data,
    } as PostData;
  });

  allPostsData.sort((a, b) => {
    if (dayjs(a.date).isBefore(dayjs(b.date))) {
      return 1;
    } else {
      return -1;
    }
  });

  return allPostsData;
}
