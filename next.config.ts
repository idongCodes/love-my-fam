import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb', // <--- Updated to 500mb
    },
  },
};

export default nextConfig;