import Image from "next/image";
import { name } from "lib/meta";
import profileImage from "public/images/profile.jpg";

const ProfileImage = ({ size }: { size?: "small" | "large" }) => (
  <Image
    className="rounded-full"
    src={profileImage}
    alt={name}
    width={size === "small" ? 96 : 192}
    height={size === "small" ? 96 : 192}
    priority
  />
);

export default ProfileImage;
