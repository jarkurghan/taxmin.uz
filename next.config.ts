import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.telegram.org" },
      { protocol: "https", hostname: "t.me" },
    ],
  },
};

export default nextConfig;
