import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabaseUrl, prisma } from "@/src/lib/db";

export const runtime = "nodejs";

const contentSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  ageBand: z.enum(["CHILD_10_12", "TEEN_13_15", "OLDER_TEEN_16_18"]),
  language: z.string().default("en"),
  readingLevel: z.string().default("middle"),
  literacyDimension: z.enum(["FUNCTIONAL", "INTERACTIVE", "CRITICAL"]),
  reviewStatus: z.enum(["SAMPLE", "DRAFT", "NEEDS_REVIEW", "REVIEWED"]).default("DRAFT")
});

export async function POST(request: Request) {
  const body = contentSchema.parse(await request.json());
  if (!hasDatabaseUrl) {
    return NextResponse.json({
      persisted: false,
      demo: true,
      material: {
        id: body.id ?? `demo-material-${Date.now()}`,
        sourceStatus: body.reviewStatus === "REVIEWED" ? "OFFICIAL_REVIEWED" : "SAMPLE",
        ...body
      }
    });
  }
  const id = body.id ?? `material-${body.topic}-${body.ageBand}-${body.language}-${Date.now()}`;
  const material = await prisma.educationMaterial.upsert({
    where: { id },
    update: body,
    create: {
      id,
      sourceStatus: body.reviewStatus === "REVIEWED" ? "OFFICIAL_REVIEWED" : "SAMPLE",
      ...body
    }
  });
  await prisma.auditLog.create({
    data: {
      id: `audit-content-${Date.now()}`,
      actorUserId: "admin",
      action: "ADMIN_CONTENT_UPSERT",
      entityType: "EducationMaterial",
      entityId: material.id,
      metadata: { reviewStatus: material.reviewStatus }
    }
  });
  return NextResponse.json({ persisted: true, material });
}
