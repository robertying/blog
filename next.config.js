const withPlugins = require("next-compose-plugins");
const optimizedImages = require("next-optimized-images");
const withMDX = require("@next/mdx");
const withBundleAnalyzer = require("@next/bundle-analyzer");

module.exports = withPlugins([
  [
    withMDX({
      extension: /\.mdx?$/,
    }),
    {
      pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    },
  ],
  [optimizedImages],
  [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === "true",
    }),
  ],
]);
