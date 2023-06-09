import Link from "next/link";
import Date from "components/Date";
import { getAllPosts } from "lib/post";

const HomePage: React.FC = async () => {
  const posts = await getAllPosts();

  return (
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
  );
};

export default HomePage;
