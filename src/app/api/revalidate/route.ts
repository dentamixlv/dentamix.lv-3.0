import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get("secret");
    
    const body = await request.json().catch(() => ({}));
    const secret = body.secret || querySecret;
    
    const expectedSecret = process.env.PRISMIC_WEBHOOK_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
      console.warn("[SECURITY] Unauthorized cache revalidation attempt. Secret mismatch.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    revalidateTag("prismic", "max");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error: any) {
    console.error("Error in revalidate API route:", error);
    return NextResponse.json({ error: error.message || "Failed to revalidate" }, { status: 500 });
  }
}
