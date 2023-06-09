import type { Metadata } from "next";
import { getReactElementFromMarkdown } from "lib/markdown";
import { getSectionById } from "lib/section";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getSectionById(id);

  return {
    title: post.title,
  };
}

const OtherPage: React.FC<{ params: { id: string } }> = async ({
  params: { id },
}) => {
  const post = await getSectionById(id);
  const element = await getReactElementFromMarkdown(post.content);

  return (
    <article className="flex flex-col">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="my-6 markdown-body">{element}</div>
    </article>
  );
};

export default OtherPage;

export async function generateStaticParams() {
  return [{ id: "about" }, { id: "projects" }];
}

const dynamicParams = false;
export { dynamicParams };
