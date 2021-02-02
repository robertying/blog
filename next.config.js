const withMDX = require("@next/mdx")({
  options: {
    remarkPlugins: [require("remark-unwrap-images")],
    rehypePlugins: [require("./plugins/imageMetadata")],
  },
  extension: /\.mdx?$/,
});

module.exports = withMDX({
  pageExtensions: ["ts", "tsx", "mdx"],
});
