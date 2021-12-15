import Image, { ImageProps } from "next/image";

export interface ImgProps {
  src: ImageProps["src"];
  alt: ImageProps["alt"];
}

const Img: React.FC<ImgProps> = ({ src, alt }) => {
  return <Image src={src} alt={alt} placeholder="blur" />;
};

export default Img;
