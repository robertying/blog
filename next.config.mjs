/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  compress: false,
  experimental: {
    outputStandalone: true,
    runtime: "nodejs",
    serverComponents: true,
  },
};

export default nextConfig;