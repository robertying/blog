import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

const Picture = ({
  src,
  className,
  ...restProps
}: DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  return (
    <div
      className={className}
      style={{
        backgroundSize: "contain",
        backgroundImage: `url(${require(`../public/images/${src}?lqip`)})`,
      }}
    >
      <picture>
        <source
          srcSet={require(`../public/images/${src}?webp`)}
          type="image/webp"
        />
        <source srcSet={require(`../public/images/${src}`)} type="image/jpeg" />
        <img
          className={className}
          src={require(`../public/images/${src}`)}
          {...restProps}
        />
      </picture>
    </div>
  );
};

export default Picture;
