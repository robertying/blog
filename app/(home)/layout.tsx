import type { Route } from "next";
import Link from "next/link";
import ProfileImage from "components/ProfileImage";
import { siteDescription, name } from "lib/meta";

const HomeLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <header className="flex flex-col items-center space-y-4">
        <ProfileImage size="large" />
        <div className="text-4xl font-extrabold">{name}</div>
        <div className="flex flex-row items-center space-x-4">
          <Link href="/about" className="text-center">
            About Me
          </Link>
          <Link href="/projects">Projects</Link>
          <Link
            href={"https://github.com/robertying" as Route}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link href={"mailto:me@ruiying.io" as Route}>Email</Link>
        </div>
        <div className="text-center">{siteDescription}</div>
      </header>
      <main className="mt-8">{children}</main>
    </>
  );
};

export default HomeLayout;
