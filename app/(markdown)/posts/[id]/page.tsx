import type { Metadata } from "next";
import Date from "components/Date";
import { getReactElementFromMarkdown } from "lib/markdown";
import { getPostById, getPostIds } from "lib/post";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getPostById(id);

  return {
    title: post.title,
    description: post.description,
  };
}

/* @ts-expect-error Async Server Component */
const PostPage: React.FC<{ params: { id: string } }> = async ({
  params: { id },
}) => {
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
