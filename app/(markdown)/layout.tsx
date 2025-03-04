import "@primer/css/dist/markdown.css";
import "./markdown.css";
import "./highlight.css";
import Link from "next/link";
import { name } from "lib/meta";
import ProfileImage from "components/ProfileImage";

const PostLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header className="flex! flex-col items-center space-y-4">
        <Link href="/">
          <ProfileImage size="small" />
        </Link>
        <div className="text-lg">{name}</div>
      </header>
      <main className="mt-8">{children}</main>
      <Link href="/" className="text-lg font-medium">
        ← Back to home
      </Link>
    </>
  );
};

export default PostLayout;
