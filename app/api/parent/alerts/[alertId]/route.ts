import { NextResponse } from "next/server";
import { hasDatabaseUrl, prisma } from "@/src/lib/db";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: Promise<{ alertId: string }> }) {
  const { alertId } = await params;
  if (!hasDatabaseUrl) return NextResponse.json({ persisted: false, alertId });
  const alert = await prisma.alert.update({ where: { id: alertId }, data: { status: "ACKNOWLEDGED" } });
  await prisma.auditLog.create({
    data: {
      id: `audit-alert-${Date.now()}`,
      actorUserId: alert.parentUserId ?? "parent-as",
      action: "PARENT_ALERT_ACKNOWLEDGED",
      entityType: "Alert",
      entityId: alert.id,
      metadata: { severity: alert.severity }
    }
  });
  return NextResponse.json({ persisted: true, alert });
}
