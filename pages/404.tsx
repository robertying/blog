import { NextSeo } from "next-seo";
import Layout from "components/Layout";

function NotFound() {
  return (
    <Layout>
      <NextSeo title="Not Found" noindex />
      <h1 className="text-3xl font-bold">You seem lost</h1>
      <p className="my-4">The stuff you requested is not found.</p>
    </Layout>
  );
}

export default NotFound;
