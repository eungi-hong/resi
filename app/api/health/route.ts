import { NextResponse } from "next/server";
import { databaseConfigured, databaseEnabled } from "@/src/lib/db";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    ok: true,
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "resi",
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
    aiProvider: process.env.AI_PROVIDER ?? "mock",
    voiceEnabled: process.env.NEXT_PUBLIC_ENABLE_VOICE === "true",
    databaseConfigured,
    databaseEnabled
  });
}
