import type { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "components/Layout";
import Date from "components/Date";
import { getAllPosts, PostData } from "lib/post";

interface HomeProps {
  posts: PostData[];
}

function Home({ posts }: HomeProps) {
  return (
    <Layout home>
      <ul className="flex flex-col space-y-8">
        {posts.map(({ id, date, title, description }) => (
          <li className="flex flex-col space-y-2" key={id}>
            <Link href={`/posts/${id}`} className="text-lg font-medium">
              {title}
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
  const posts = await getAllPosts();
  return {
    props: {
      posts,
    },
  };
};

export default Home;
