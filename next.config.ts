import type { NextConfig } from "next";

import withPWAInit from "@ducanh2912/next-pwa";

import { baseURL } from "./src/utils/common.ts";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        handler: "NetworkOnly",
        urlPattern: ({ url }: { url: URL }) => {
          return url.origin === baseURL;
        },
      },
    ],
  },
});

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

export default withPWA(nextConfig);
