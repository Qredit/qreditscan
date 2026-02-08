import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/api";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    const result = await search(q);
    if (result) return NextResponse.json(result);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
