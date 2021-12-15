const matter = require("gray-matter");
const stringifyObject = require("stringify-object");

module.exports = function (src) {
  const { content, data } = matter(src);
  return `export const metadata = ${stringifyObject(data)}\n${content}`;
};
