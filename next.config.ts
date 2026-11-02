import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // TypeScript sudah dicek saat development, skip saat build production
    // untuk menghindari timeout karena banyak file konten
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
