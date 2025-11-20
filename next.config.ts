import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    cssChunking: true, // https://nextjs.org/docs/app/api-reference/config/next-config-js/cssChunking
  },
  cacheComponents: true,
  images: {
    qualities: [100, 90, 75],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
        port: "",
        search: "",
      },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      // Redirect all requests to naked domain to www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "jimmodel.com",
          },
        ],
        destination: "https://www.jimmodel.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
