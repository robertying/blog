import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Layout from "components/Layout";
import Date from "components/Date";
import { PostData } from "lib/post";
import { siteName } from "lib/meta";

export interface PostProps {
  metadata: PostData;
}

const Post: React.FC<React.PropsWithChildren<PostProps>> = ({ children, metadata }) => {
  const router = useRouter();

  return (
    <Layout>
      <NextSeo
        title={metadata.title}
        description={metadata.description}
        openGraph={{
          url: `https://robertying.io${router.asPath}`,
          title: `${metadata.title} | ${siteName}`,
          description: metadata.description,
        }}
      />
      <article className="flex flex-col">
        <h1 className="text-3xl font-bold">{metadata.title}</h1>
        {metadata.date && (
          <Date
            className="mt-2 text-gray-600 dark:text-gray-400"
            dateString={metadata.date}
          />
        )}
        <div className="my-6 markdown-body">{children}</div>
      </article>
    </Layout>
  );
};

export default Post;
