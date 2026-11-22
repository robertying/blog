import path from "node:path";
import sharp from "sharp";

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

// "//host", "http://", "https://", …
const remoteUrl = /^(?:[a-z][a-z\d+.-]*:)?\/\//i;

/**
 * Sets width and height on <img> elements that point at a file under `dir`, so
 * next/image can render them. Remote images are left alone.
 */
export default function rehypeImageSize({ dir }: { dir: string }) {
  return async (tree: HastNode) => {
    const images: HastNode[] = [];
    const collect = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "img") {
        images.push(node);
      }
      node.children?.forEach(collect);
    };
    collect(tree);

    await Promise.all(
      images.map(async (node) => {
        const properties = node.properties ?? {};
        const src = properties.src;
        if (typeof src !== "string" || remoteUrl.test(src)) {
          return;
        }
        // Runs at build time only; the ignore comment keeps Turbopack from
        // tracing the whole project into the standalone output.
        const file = path.join(
          /* turbopackIgnore: true */ process.cwd(),
          dir,
          src,
        );
        const { width, height } = await sharp(file).metadata();
        properties.width = width;
        properties.height = height;
        node.properties = properties;
      }),
    );
  };
}
