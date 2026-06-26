import { NextResponse } from "next/server";
import { z } from "zod";
import { runAndPersistYouthChat } from "@/src/lib/data/chatPersistence";
import type { AgeBand, Language } from "@/src/lib/types";

export const runtime = "nodejs";
// OpenAI structured output (~7s) plus DB persistence can exceed the default
// serverless limit; give the function room so it isn't killed mid-call.
export const maxDuration = 30;

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  youthUserId: z.string().default("asha"),
  conversationId: z.string().optional(),
  ageBand: z.enum(["CHILD_10_12", "TEEN_13_15", "OLDER_TEEN_16_18"]).default("TEEN_13_15"),
  language: z.enum(["en", "zh", "ms", "ta"]).default("en"),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .max(20)
    .optional()
});

export async function POST(request: Request) {
  const body = chatSchema.parse(await request.json());
  const response = await runAndPersistYouthChat({
    youthUserId: body.youthUserId,
    conversationId: body.conversationId,
    message: body.message,
    ageBand: body.ageBand as AgeBand,
    language: body.language as Language,
    history: body.history
  });
  return NextResponse.json(response);
}
