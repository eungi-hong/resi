import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/src/lib/db";

export const runtime = "nodejs";

const quizAttemptSchema = z.object({
  youthUserId: z.string(),
  quizId: z.string(),
  score: z.number().int().min(0),
  answers: z.record(z.number().int()),
  literacyUpdates: z.array(z.object({
    topic: z.string(),
    dimension: z.enum(["FUNCTIONAL", "INTERACTIVE", "CRITICAL"]),
    score: z.number().int(),
    confidence: z.number(),
    evidence: z.array(z.string())
  }))
});

export async function POST(request: Request) {
  const body = quizAttemptSchema.parse(await request.json());
  if (!hasDatabaseUrl) return NextResponse.json({ persisted: false, reason: "DATABASE_URL not configured" });

  await prisma.quizAttempt.create({
    data: {
      id: `quiz-attempt-${body.youthUserId}-${Date.now()}`,
      youthUserId: body.youthUserId,
      quizId: body.quizId,
      score: body.score,
      answers: body.answers,
      literacyUpdates: body.literacyUpdates
    }
  });

  await Promise.all(body.literacyUpdates.map((metric) =>
    prisma.healthLiteracyMetric.upsert({
      where: { youthUserId_topic_dimension: { youthUserId: body.youthUserId, topic: metric.topic, dimension: metric.dimension } },
      update: { score: metric.score, confidence: metric.confidence, evidence: metric.evidence },
      create: {
        id: `metric-${body.youthUserId}-${metric.topic}-${metric.dimension}`,
        youthUserId: body.youthUserId,
        topic: metric.topic,
        dimension: metric.dimension,
        score: metric.score,
        confidence: metric.confidence,
        evidence: metric.evidence
      }
    })
  ));

  return NextResponse.json({ persisted: true });
}
