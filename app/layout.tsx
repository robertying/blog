import "@primer/css/dist/primitives.css";
import "@primer/css/dist/color-modes.css";
import "@primer/css/dist/base.css";
import "./globals.css";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteName, siteDescription, name } from "lib/meta";

export const metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: {
    name,
  },
  manifest: "/manifest.json",
};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark_dimmed"
      >
        <div className="max-w-2xl mx-auto px-6 my-12">
          {children}
          <footer className="text-xs mt-16 flex! flex-col space-y-4 items-center">
            <Link
              href={
                "https://creativecommons.org/licenses/by-nc-sa/4.0/" as Route
              }
              target="_blank"
              rel="license noopener noreferrer"
            >
              CC BY-NC-SA 4.0
            </Link>
            <span>
              <Image
                className="inline"
                src="/mps-beian.png"
                alt=""
                style={{
                  width: "1rem",
                  height: "auto",
                }}
                width={16}
                height={16}
              />{" "}
              <Link
                href="https://beian.mps.gov.cn/#/query/webSearch?code=33021202003727"
                target="_blank"
                rel="noopener noreferrer"
              >
                浙公网安备33021202003727号
              </Link>
            </span>
            <Link
              href={"https://beian.miit.gov.cn/" as Route}
              target="_blank"
              rel="noopener noreferrer"
            >
              浙ICP备20024838号-1
            </Link>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
