import Image from "next/image";
import { name } from "lib/meta";

const ProfileImage = ({ size }: { size?: "small" | "large" }) => (
  <Image
    className="rounded-full"
    src="/images/profile.jpg"
    alt={name}
    width={size === "small" ? 96 : 192}
    height={size === "small" ? 96 : 192}
    priority
  />
);

export default ProfileImage;
