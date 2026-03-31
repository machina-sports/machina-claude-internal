import { NextRequest, NextResponse } from "next/server";
import { searchDocs } from "@/lib/docs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = searchDocs(q.trim());
  return NextResponse.json({ results });
}
