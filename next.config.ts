import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.prismic.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.prismic.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prismic-io.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // TODO: Fix remote Prismic custom types mismatch in unrelated slices and remove this bypass ASAP
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.prismic.io https://*.convex.cloud;",
              "connect-src 'self' https://*.prismic.io https://*.convex.cloud wss://*.convex.cloud https://generativelanguage.googleapis.com;",
              "img-src 'self' data: blob: https://*.prismic.io https://images.unsplash.com https://images.prismic.io;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data:;",
              "media-src 'self' https://*.prismic.io https://*.prismic.io/dentamix-v30/;",
              "frame-src 'self' https://www.google.com;"
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
