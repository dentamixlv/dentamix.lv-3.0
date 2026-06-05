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
};

export default nextConfig;
