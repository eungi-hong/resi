import { NextResponse } from "next/server";
import { runResiYouthPipeline } from "@/src/lib/ai/orchestrator";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await runResiYouthPipeline(String(body.message ?? ""), {
    ageBand: body.ageBand ?? "TEEN_13_15",
    language: body.language ?? "en"
  });
  return NextResponse.json(response);
}
