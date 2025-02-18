import { strict } from "assert";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewarePrefetch: "strict",
  },
};

export default nextConfig;
