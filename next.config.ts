import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ["rc-util"],
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
};

export default nextConfig;
