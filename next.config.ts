import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: [
    'rc-util',
    "rc-picker",
    "rc-pagination",
    "@ant-design/icons-svg"
  ]
};

export default nextConfig;
