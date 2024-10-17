import type { Metadata } from "next";
import Date from "components/Date";
import { getReactElementFromMarkdown } from "lib/markdown";
import { getPostById, getPostIds } from "lib/post";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { id } = params;

  const post = await getPostById(id);

  return {
    title: post.title,
    description: post.description,
  };
}

const PostPage: React.FC<{ params: Promise<{ id: string }> }> = async (
  props,
) => {
  const params = await props.params;

  const { id } = params;

  const post = await getPostById(id);
  const element = await getReactElementFromMarkdown(post.content);

  return (
    <article className="flex flex-col">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      {post.date && (
        <Date
          className="mt-2 text-gray-600 dark:text-gray-400"
          dateString={post.date}
        />
      )}
      <div className="my-6 markdown-body">{element}</div>
    </article>
  );
};

export default PostPage;

export async function generateStaticParams() {
  const postIds = await getPostIds();
  return postIds.map((id) => ({ id }));
}

const dynamicParams = false;
export { dynamicParams };
