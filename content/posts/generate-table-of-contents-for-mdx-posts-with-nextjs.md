---
title: Generate Table of Contents for MDX Posts with NextJS
date: "2021-02-04T17:27:00.000-08:00"
description: I've rewritten my blog (this blog) several times, the latest of which is built with MDX and NextJS. With frontmatter not being an option, I had to find a MDX-compatible way to generate the table of contents for my posts.
---

I started the transition to [MDX](https://mdxjs.com/) because I was using [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images) for image optimization. It provides an `Img` component and the component replies on webpack's `require` call to import images. Therefore, I cannot import images dynamically and wrap every `<img>` within `Img` in `MDX provider's components` which is used to customize Markdown-parsed parts, like `<a>`, `<img>`, `<p>`, etc.

So I import `Img` and explicitly place it where there is a picture:

```
import Img from "react-optimized-image";

## Hi LA

<Img src={require("assets/images/welcome-to-usa.jpg")} alt="LA airport" webp />;
```

The existence of JSX content makes it hard to use something like [gray-matter](https://github.com/jonschlinkert/gray-matter) to extract frontmatter from MDX document to read metadata.

Well. Right after I typed these words, I start to wonder if this is actually possible, with some extra step to remove the frontmatter before MDX gets processed. And yes, there is a page on how to use `gray-matter` with MDX 😅. See [Custom Loader](https://mdxjs.com/guides/custom-loader).

## Custom Loader

As long as we can handle frontmatter in MDX, we could follow NextJS's doc on [building a blog](https://github.com/vercel/next-learn-starter) to generate a table of contents.

> Update:
>
> After I wrote this post, I did some work to adopt this approach.
>
> There seems to be some extra work if you want to use the custom loader with NextJS.

After completing the custom loader script, I need to add the loader before MDX's, which involves changing babel configurations.

With NextJS, we better use plugins to help change babel configurations. Here is the full `next.config.js` to add our custom loader to the chain:

```js
const withPlugins = require("next-compose-plugins");

const withMDX = require("@next/mdx")({
  options: {
    remarkPlugins: [
      /* some plugins */
    ],
    rehypePlugins: [
      /* some plugins */
    ],
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

module.exports = withPlugins([
  [withFrontmatter],
  [
    withMDX,
    {
      pageExtensions: ["ts", "tsx", "mdx"],
    },
  ],
]);
```

`./plugins/frontmatter` should be where you place the custom loader script.

Be aware that plugins/loaders run in the order of last to first.

## Alternative Path

There is another way of doing this which involves using JS code in MDX and Babel parsing.

### Export Metadata

It's worth mentioning that you can treat the whole MDX file as a module and access JS objects that are exported from it.

For example, with the following MDX content:

```
export const metadata = {
  title: "Generate Table of Contents for MDX Posts with NextJS",
  date: "2021-02-04T17:27:00.000+08:00",
  description:
    "I've rewritten my blog (this blog) several times, the latest of which is built with MDX and NextJS. With frontmatter not being an option, I had to find a MDX-compatible way to generate the table of contents for my posts.",
};

# Hi

It's me.
```

The constant `metadata` will be passed as a prop into MDX's provider component `wrapper`, which shall be used like this:

```tsx
const components = {
  wrapper: ({ children, metadata }) => <Something />,
};

<MDXProvider components={components}>
  <MainStuff />
</MDXProvider>;
```

Here, `children` is a React component rendered from your MDX content and `metadata` is the constant that gets exported from the file. `<Something />` can take advantage of those props.

### Table of Contents

This is sufficient for a single document. However, if you are trying to generate the table of contents for all your MDX documents in NextJS. There is no conveneint way to get those props. The easiest way that I found is to use `Babel` to parse the `export const metadata` JS code and manually extract them during NextJS's `getStaticProps` phase.

Assuming exports are separated from the main content with a newline, we could do the following to find what `metadata` is exported:

```ts
const ast = require("@babel/parser").parse(
  fileContents.split("\n\n").find((t) => t.startsWith("export const metadata")),
  {
    sourceType: "module",
  }
);

const metadataAst = ast.program.body[0].declaration.declarations.find(
  (d) => d.id.name === "metadata"
);

const properties = metadataAst.init.properties;

const metadata = properties.reduce(
  (acc, cur) => ({
    ...acc,
    [cur.key.name]: cur.value.value,
  }),
  {}
);
```

- Find the `export const metadata` code block.
- Parse it into AST.
- Get `metadata`'s corresponding AST node's properties.
- Reconstrcut the object from them.

This solution does its job, but it's not elegant or robust as the first one.
