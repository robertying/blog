import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Layout from "components/Layout";
import Date from "components/Date";
import utilStyles from "styles/utils.module.css";
import { PostData } from "lib/posts";
import { siteName } from "lib/meta";

export interface PostProps {
  metadata: PostData;
}

const Post: React.FC<PostProps> = ({ children, metadata }) => {
  const router = useRouter();

  return (
    <Layout>
      <NextSeo
        title={metadata.title}
        description={metadata.description}
        openGraph={{
          url: `https://robertying.io${router.pathname}`,
          title: `${metadata.title} | ${siteName}`,
          description: metadata.description,
        }}
      />
      <article>
        <h1 className={utilStyles.headingXl}>{metadata.title}</h1>
        {metadata.date && (
          <div className={`${utilStyles.lightText} ${utilStyles.listItem}`}>
            <Date dateString={metadata.date} />
          </div>
        )}
        <div className="markdown-body">{children}</div>
      </article>
    </Layout>
  );
};

export default Post;
