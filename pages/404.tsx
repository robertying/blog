import { NextSeo } from "next-seo";
import utilStyles from "styles/utils.module.css";
import Layout from "components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <NextSeo title="Not Found" />
      <h1 className={utilStyles.headingXl}>Are you lost?</h1>
      <p>The stuff you requested is not found.</p>
    </Layout>
  );
}
