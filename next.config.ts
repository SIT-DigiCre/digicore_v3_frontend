import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "s3.ap-northeast-1.wasabisys.com",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
