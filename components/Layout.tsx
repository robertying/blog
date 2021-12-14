import Link from "next/link";
import { name, siteDescription } from "lib/meta";

const ProfileImage = ({ size }: { size?: "small" | "large" }) => (
  // eslint-disable-next-line
  <img
    className="rounded-full"
    src="/images/profile.jpg"
    alt={name}
    width={size === "small" ? 96 : 192}
    height={size === "small" ? 96 : 192}
  />
);

export interface LayoutProps {
  children: React.ReactNode;
  home?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, home }) => {
  return (
    <div className="max-w-xl mx-auto px-6 my-12">
      <header className="flex flex-col items-center space-y-4">
        {home ? (
          <>
            <ProfileImage size="large" />
            <div className="text-4xl font-extrabold">{name}</div>
            <div className="flex flex-row items-center space-x-4">
              <Link href="/about">
                <a className="text-center">About Me</a>
              </Link>
              <Link href="/projects">
                <a>Projects</a>
              </Link>
              <a
                href="https://github.com/robertying"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a href="mailto:yingrui205@gmail.com">Email</a>
            </div>
            <div className="text-center">{siteDescription}</div>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <ProfileImage size="small" />
              </a>
            </Link>
            <div className="text-lg">{name}</div>
          </>
        )}
      </header>
      <main className="mt-8">{children}</main>
      {!home && (
        <Link href="/">
          <a className="text-lg font-medium">← Back to home</a>
        </Link>
      )}
      <footer className="text-xs mt-16 flex flex-col space-y-4 items-center">
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="license noopener noreferrer"
        >
          CC BY-NC-SA 4.0
        </a>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          浙ICP备20024838号-1
        </a>
      </footer>
    </div>
  );
};

export default Layout;
