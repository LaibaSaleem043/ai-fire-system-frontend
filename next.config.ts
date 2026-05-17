import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/evidence_frames/**',
      },
      {
        protocol: 'https',
        hostname: 'laiba1232-smoke.hf.space',
        pathname: '/evidence_frames/**',
      },
    ],
  },
};

export default nextConfig;
