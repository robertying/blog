const withPlugins = require("next-compose-plugins");

const withMDX = require("@next/mdx")({
  options: {
    remarkPlugins: [require("remark-unwrap-images")],
    rehypePlugins: [require("./plugins/imageMetadata")],
  },
  extension: /\.mdx?$/,
});

const withFrontmatter = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules = config.module.rules.map((rule) => {
        if (rule.test && rule.test.test(".mdx")) {
          return {
            ...rule,
            use: [...rule.use, require.resolve("./plugins/frontmatter")],
          };
        } else {
          return rule;
        }
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

module.exports = withPlugins(
  [
    [withFrontmatter],
    [
      withMDX,
      {
        pageExtensions: ["ts", "tsx", "mdx"],
      },
    ],
  ],
  {
    reactStrictMode: true,
  }
);
