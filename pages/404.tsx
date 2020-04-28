import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function NotFound() {
  return (
    <Layout>
      <Head>
        <title>404 Not Found | {siteTitle}</title>
      </Head>
      <h1 className={utilStyles.headingXl}>Are you lost?</h1>
      <p>The stuff you requested is not found.</p>
    </Layout>
  );
}
