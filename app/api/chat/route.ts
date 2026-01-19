import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ reply: "API_OK_123" });
}
