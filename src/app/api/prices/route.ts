import { NextResponse } from "next/server";
import { getPricesFromGoogleSheets } from "../../../data/prices";

export async function GET() {
  try {
    const results = await getPricesFromGoogleSheets();
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error fetching or parsing Google Sheets prices in API route:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch prices" }, { status: 500 });
  }
}

