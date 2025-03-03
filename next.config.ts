import { strict } from "assert";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewarePrefetch: "strict",
  },
  typescript: {
    // ⚠️ Désactiver temporairement la vérification des types pendant le build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
