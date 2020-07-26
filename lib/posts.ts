import dayjs from "dayjs";
import fs from "fs";
import path from "path";

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
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const ast = require("@babel/parser").parse(
      fileContents
        .split("\n\n")
        .find((t) => t.startsWith("export const metadata")),
      {
        sourceType: "module",
      }
    );
    const metadataAst = ast.program.body[0].declaration.declarations.find(
      (d: any) => d.id.name === "metadata"
    );
    const properties = metadataAst.init.properties;

    const metadata = properties.reduce(
      (acc: any, cur: any) => ({
        ...acc,
        [cur.key.name]: cur.value.value,
      }),
      {}
    );

    return {
      id,
      ...metadata,
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
