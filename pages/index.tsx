import { GetStaticProps } from "next";
import Link from "next/link";
import utilStyles from "styles/utils.module.css";
import Layout from "components/Layout";
import Date from "components/Date";
import { getSortedPostsData, PostData } from "lib/post";

interface HomeProps {
  allPostsData: PostData[];
}

export default function Home({ allPostsData }: HomeProps) {
  return (
    <Layout home>
      <section className={`${utilStyles.headingMd} ${utilStyles.center}`}>
        <p>
          EE undergraduate at Tsinghua University. Incoming CS MS graduate at
          Stanford University.
        </p>
        <p>💻 Love computer stuff.</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title, description }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <p className={utilStyles.description}>{description}</p>
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
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
