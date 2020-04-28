import Layout, { siteTitle } from "../components/layout";
import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";
import { getRootPageData, RootData } from "../lib/root";

export default function About({ data }: { data: RootData }) {
  return (
    <Layout>
      <Head>
        <title>
          {data.title} | {siteTitle}
        </title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{data.title}</h1>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: data.contentHtml }}
        />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "about" } }, { params: { id: "projects" } }],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const data = await getRootPageData(params!.id as string);

  return {
    props: {
      data,
    },
  };
};
