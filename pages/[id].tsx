import type { ParsedUrlQuery } from "querystring";
import type { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import Layout from "components/Layout";
import { getHtmlFromMarkdown } from "lib/markdown";
import { getSectionById, getSectionIds, SectionData } from "lib/section";

interface SectionProps {
  section: SectionData;
  body: string;
}

interface SectionParams extends ParsedUrlQuery {
  id: string;
}

const Section: React.FC<SectionProps> = ({ section, body }) => {
  return (
    <Layout>
      <NextSeo title={section.title} />
      <article className="flex flex-col">
        <h1 className="text-3xl font-bold">{section.title}</h1>
        <div
          className="my-6 markdown-body"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </article>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<
  SectionProps,
  SectionParams
> = async ({ params }) => {
  const section = await getSectionById(params!.id);
  const body = await getHtmlFromMarkdown(section.content);

  return {
    props: {
      section,
      body,
    },
  };
};

export const getStaticPaths: GetStaticPaths<SectionParams> = async () => {
  const sectionIds = await getSectionIds();

  return {
    paths: sectionIds.map((id) => {
      return {
        params: {
          id,
        },
      };
    }),
    fallback: false,
  };
};

export default Section;
