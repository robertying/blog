import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: false,
  reactCompiler: true,
};

export default nextConfig;
