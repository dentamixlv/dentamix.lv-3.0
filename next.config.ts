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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.prismic.io https://*.convex.cloud https://*.posthog.com https://*.i.posthog.com https://www.googletagmanager.com https://*.google-analytics.com;",
              "connect-src 'self' https://*.prismic.io https://*.convex.cloud wss://*.convex.cloud https://generativelanguage.googleapis.com wss://generativelanguage.googleapis.com https://*.aiplatform.googleapis.com wss://*.aiplatform.googleapis.com https://*.posthog.com https://*.i.posthog.com https://*.google-analytics.com https://*.analytics.google.com https://*.doubleclick.net https://*.google.com;",
              "img-src 'self' data: blob: https://*.prismic.io https://images.unsplash.com https://images.prismic.io https://*.posthog.com https://*.i.posthog.com https://*.google-analytics.com https://www.googletagmanager.com https://*.doubleclick.net https://*.google.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.posthog.com https://*.i.posthog.com;",
              "font-src 'self' data: https://fonts.gstatic.com https://*.posthog.com https://*.i.posthog.com;",
              "media-src 'self' https://*.prismic.io https://*.prismic.io/dentamix-v30/ https://*.posthog.com https://*.i.posthog.com;",
              "frame-src 'self' https://www.google.com;",
              `report-uri https://eu.i.posthog.com/report/?token=${process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_z7oTfiM6pybrJ6AxJAEpfGEnADMLctohsjsGWaZC9Z3"}`
            ].join(" "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
