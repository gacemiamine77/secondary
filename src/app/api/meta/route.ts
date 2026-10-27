import { NextResponse } from "next/server";
import { EMPTY_META, getMeta } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const meta = await getMeta();
    return NextResponse.json(meta);
  } catch (error) {
    console.error("[api/meta] error", error);
    return NextResponse.json(EMPTY_META);
  }
}
