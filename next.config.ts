import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: false,
  reactCompiler: true,
  experimental: {
    // TS CLI detection expects a `tsc` bin; our aliased `typescript` package
    // (@typescript/typescript6, kept for typescript-eslint compatibility with
    // TS 7) only exposes `tsc6`, so fall back to the TS API-based checker.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
