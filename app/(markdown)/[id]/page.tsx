import type { Metadata } from "next";
import { getReactElementFromMarkdown } from "lib/markdown";
import { getSectionById } from "lib/section";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { id } = params;

  const post = await getSectionById(id);

  return {
    title: post.title,
  };
}

const OtherPage: React.FC<{ params: Promise<{ id: string }> }> = async (
  props,
) => {
  const params = await props.params;

  const { id } = params;

  const post = await getSectionById(id);
  const element = await getReactElementFromMarkdown(post.content);

  return (
    <article className="flex! flex-col">
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
