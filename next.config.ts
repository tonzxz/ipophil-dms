import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} as NextConfig;    

export default nextConfig;