import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // image size setting : <= 10MB
    },
  },
  images: {
    remotePatterns: [
      { hostname: "*.googleusercontent.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "phinf.pstatic.net" },
      { hostname: "*.kakaocdn.net" },
      { hostname: "localhost", port: "3000", protocol: "http" },
      { hostname: "ssl.pstatic.net" },
    ],
  },
};

export default nextConfig;
