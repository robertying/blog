const { promisify } = require("util");
const path = require("path");
const visit = require("unist-util-visit");
const sizeOf = promisify(require("image-size"));

const isImageNode = (node) => {
  const img = node;
  return (
    img.type === "element" &&
    img.tagName === "img" &&
    img.properties &&
    typeof img.properties.src === "string"
  );
};

const filterImageNode = (node) => {
  return node.properties.src.startsWith("/");
};

const addMetadata = async (node) => {
  const res = await sizeOf(
    path.join(process.cwd(), "public", node.properties.src)
  );

  if (!res) {
    throw Error(`Invalid image with src "${node.properties.src}"`);
  }

  if (4 < res.orientation && res.orientation < 9) {
    node.properties.width = res.height;
    node.properties.height = res.width;
  } else {
    node.properties.width = res.width;
    node.properties.height = res.height;
  }
};

module.exports = () => async (tree) => {
  const imgNodes = [];

  visit(tree, "element", (node) => {
    if (isImageNode(node) && filterImageNode(node)) {
      imgNodes.push(node);
    }
  });

  for (const node of imgNodes) {
    await addMetadata(node);
  }

  return tree;
};
