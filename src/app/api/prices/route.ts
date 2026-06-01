import { NextRequest, NextResponse } from "next/server";
import { getPricesFromGoogleSheets } from "../../../data/prices";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "lv";
    
    const results = await getPricesFromGoogleSheets(lang);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error fetching or parsing Google Sheets prices in API route:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch prices" }, { status: 500 });
  }
}

