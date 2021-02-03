import type { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "components/Layout";
import Date from "components/Date";
import { getSortedPostsData, PostData } from "lib/post";

interface HomeProps {
  allPostsData: PostData[];
}

export default function Home({ allPostsData }: HomeProps) {
  return (
    <Layout home>
      <ul className="flex flex-col space-y-8">
        {allPostsData.map(({ id, date, title, description }) => (
          <li className="flex flex-col space-y-2" key={id}>
            <Link href={`/posts/${id}`}>
              <a className="text-lg font-medium">{title}</a>
            </Link>
            <p>{description}</p>
            <Date
              className="text-gray-600 dark:text-gray-400 text-sm"
              dateString={date}
            />
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
