import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    cssChunking: true,
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
      {
        protocol: "https",
        hostname: "pub-9f60895f20504ca6b35927a571998669.r2.dev",
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

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
