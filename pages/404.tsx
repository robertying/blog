import { NextSeo } from "next-seo";
import Layout from "components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <NextSeo title="Not Found" />
      <h1 className="text-3xl font-bold">Are you lost?</h1>
      <p className="my-4">The stuff you requested is not found.</p>
    </Layout>
  );
}
