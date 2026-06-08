"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

if (typeof window !== "undefined" && !convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not defined. Convex will not connect.");
}

// Fallback to dummy URL during build phase to avoid crash
const convex = new ConvexReactClient(convexUrl || "https://placeholder-url.convex.cloud");

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
