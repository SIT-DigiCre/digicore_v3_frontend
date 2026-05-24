import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:
      process.env.NODE_ENV === "production"
        ? [
            {
              hostname: "s3.ap-northeast-1.wasabisys.com",
              pathname: "/**",
              protocol: "https",
            },
          ]
        : [
            {
              hostname: "s3.ap-northeast-1.wasabisys.com",
              pathname: "/**",
              protocol: "https",
            },
            {
              hostname: "example.com", // デバッグ用
              pathname: "/**",
              protocol: "https",
            },
          ],
  },
};

export default nextConfig;
