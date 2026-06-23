import { PrismaClient } from "@prisma/client";
import { getMissingAvatarAssets } from "../src/data/avatarManifest";
import { readFileSync, existsSync } from "node:fs";

async function main() {
  const checks: { name: string; ok: boolean; detail?: string }[] = [];
  const requiredFiles = ["README.md", "docs/deployment-mode-b.md", "docs/live-demo-checklist.md", "docs/hackathon-submission.md", "prisma/schema.prisma"];

  for (const file of requiredFiles) {
    checks.push({ name: `file:${file}`, ok: existsSync(file) });
  }

  const schema = readFileSync("prisma/schema.prisma", "utf8");
  checks.push({ name: "prisma-provider-postgresql", ok: schema.includes('provider  = "postgresql"') || schema.includes('provider = "postgresql"') });
  checks.push({ name: "database-url-present", ok: Boolean(process.env.DATABASE_URL), detail: process.env.DATABASE_URL ? "configured" : "missing for local check" });
  checks.push({ name: "demo-mode-env", ok: process.env.NEXT_PUBLIC_DEMO_MODE !== "false" });
  checks.push({ name: "mock-ai-available", ok: (process.env.AI_PROVIDER ?? "mock") === "mock" || Boolean(process.env.OPENAI_API_KEY) });

  const missingAvatars = getMissingAvatarAssets();
  checks.push({ name: "avatar-audit", ok: missingAvatars.length === 0, detail: `${missingAvatars.length} missing required PNG assets` });

  if (process.env.DATABASE_URL) {
    const prisma = new PrismaClient();
    try {
      await prisma.$queryRaw`SELECT 1`;
      const [users, materials, quizzes] = await Promise.all([
        prisma.user.count(),
        prisma.educationMaterial.count(),
        prisma.quiz.count()
      ]);
      checks.push({ name: "db-connectivity", ok: true });
      checks.push({ name: "seed-users", ok: users >= 6, detail: `${users} users` });
      checks.push({ name: "seed-materials", ok: materials >= 21, detail: `${materials} materials` });
      checks.push({ name: "seed-quizzes", ok: quizzes >= 21, detail: `${quizzes} quizzes` });
    } catch (error) {
      checks.push({ name: "db-connectivity", ok: false, detail: error instanceof Error ? error.message : "unknown error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  console.log("resi deployment readiness");
  for (const check of checks) {
    console.log(`${check.ok ? "✓" : "✗"} ${check.name}${check.detail ? ` - ${check.detail}` : ""}`);
  }

  const hardFailures = checks.filter((check) => !check.ok && check.name !== "avatar-audit" && check.name !== "database-url-present");
  if (hardFailures.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
