import path from "path";
import fs from "fs-extra";
import sharp from "sharp";

const imageDirectory = path.join(process.cwd(), "public/images");

const fileNames = await fs.readdir(imageDirectory, { withFileTypes: true });
const imageNames = fileNames
  .filter(
    (f) => f.isFile() && (f.name.endsWith(".jpg") || f.name.endsWith(".png"))
  )
  .map((f) => f.name);

await Promise.all(
  imageNames.map((imageName) => {
    const { name } = path.parse(imageName);
    const originalPath = path.join(imageDirectory, imageName);
    return Promise.all([
      sharp(originalPath)
        .avif()
        .toFile(path.join(imageDirectory, `${name}.avif`)),
      sharp(originalPath)
        .webp()
        .toFile(path.join(imageDirectory, `${name}.webp`)),
    ]);
  })
);
