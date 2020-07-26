import styles from "./Layout.module.css";
import utilStyles from "styles/utils.module.css";
import Link from "next/link";
import Img from "react-optimized-image";
import { name } from "lib/meta";

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {home ? (
          <>
            <Img
              src={require("assets/images/profile.jpg")}
              webp
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
              width="192"
              height="192"
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
            <div className={styles.links}>
              <Link href="/about">
                <a>About Me</a>
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
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Img
                  src={require("assets/images/profile.jpg")}
                  webp
                  className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
                  alt={name}
                  width="192"
                  height="192"
                />
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
      <footer className={styles.footer}>
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="license noopener noreferrer"
        >
          CC BY-NC-SA 4.0
        </a>
        <a
          href="http://www.beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          浙ICP备20024838号
        </a>
      </footer>
    </div>
  );
}
