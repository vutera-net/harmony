import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@harmony/api", "@harmony/auth", "@harmony/database", "@harmony/domain"],
};

export default nextConfig;
