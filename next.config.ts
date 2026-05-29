import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
