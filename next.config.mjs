import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  runtimeCaching: [
    {
      handler: "NetworkOnly",
      urlPattern: ({ url }) => {
        return url.origin === baseURL;
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
