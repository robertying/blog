import { lazy, Suspense } from "react";
import type { ParsedUrlQuery } from "querystring";
import type { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Layout from "components/Layout";
import { getPostById, getPostIds, PostData } from "lib/post";
import { getHtmlFromMarkdown } from "lib/markdown";

const Date = lazy(() => import("components/Date"));

interface PostProps {
  post: PostData;
  body: string;
}

interface PostParams extends ParsedUrlQuery {
  id: string;
}

const Post: React.FC<PostProps> = ({ post, body }) => {
  return (
    <Layout>
      <NextSeo title={post.title} description={post.description} />
      <article className="flex flex-col">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.date && (
          <Suspense fallback="...">
            <Date
              className="mt-2 text-gray-600 dark:text-gray-400"
              dateString={post.date}
            />
          </Suspense>
        )}
        <div
          className="my-6 markdown-body"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </article>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PostProps, PostParams> = async ({
  params,
}) => {
  const post = await getPostById(params!.id);
  const body = await getHtmlFromMarkdown(post.content);

  return {
    props: {
      post: post,
      body,
    },
  };
};

export const getStaticPaths: GetStaticPaths<PostParams> = async () => {
  const postIds = await getPostIds();

  return {
    paths: postIds.map((id) => {
      return {
        params: {
          id,
        },
      };
    }),
    fallback: false,
  };
};

export default Post;
