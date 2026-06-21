import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compila o source TS/JSX dos packages do workspace (modelo copy-paste).
  transpilePackages: ["@beviq/ui"],
};

export default nextConfig;
