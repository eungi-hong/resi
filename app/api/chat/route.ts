import { NextResponse } from "next/server";
import { z } from "zod";
import { runAndPersistYouthChat } from "@/src/lib/data/chatPersistence";
import type { AgeBand, Language } from "@/src/lib/types";

export const runtime = "nodejs";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  youthUserId: z.string().default("asha"),
  conversationId: z.string().optional(),
  ageBand: z.enum(["CHILD_10_12", "TEEN_13_15", "OLDER_TEEN_16_18"]).default("TEEN_13_15"),
  language: z.enum(["en", "zh", "ms", "ta"]).default("en")
});

export async function POST(request: Request) {
  const body = chatSchema.parse(await request.json());
  const response = await runAndPersistYouthChat({
    youthUserId: body.youthUserId,
    conversationId: body.conversationId,
    message: body.message,
    ageBand: body.ageBand as AgeBand,
    language: body.language as Language
  });
  return NextResponse.json(response);
}
