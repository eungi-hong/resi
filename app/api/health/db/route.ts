import { NextResponse } from "next/server";
import { databaseConfigured, databaseEnabled, prisma } from "@/src/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!databaseConfigured) {
    return NextResponse.json({ ok: false, databaseConfigured: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    const [users, materials, conversations] = await Promise.all([
      prisma.user.count(),
      prisma.educationMaterial.count(),
      prisma.conversation.count()
    ]);
    return NextResponse.json({
      ok: true,
      databaseConfigured: true,
      databaseEnabled,
      seedStatus: users >= 6 && materials >= 21 ? "ready" : "seed-data-missing",
      counts: { users, materials, conversations }
    });
  } catch (error) {
    return NextResponse.json({ ok: false, databaseConfigured: true, error: error instanceof Error ? error.message : "Database check failed." }, { status: 503 });
  }
}
