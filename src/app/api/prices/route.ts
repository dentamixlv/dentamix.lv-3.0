import { NextRequest, NextResponse } from "next/server";
import { getPricesFromGoogleSheets } from "../../../data/prices";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "lv";
    const refresh = searchParams.get("refresh") === "1" || searchParams.get("refresh") === "true";
    
    const results = await getPricesFromGoogleSheets(lang, refresh);
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error: any) {
    console.error("Error fetching or parsing Google Sheets prices in API route:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch prices" }, { status: 500 });
  }
}

