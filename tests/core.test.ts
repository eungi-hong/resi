import { describe, expect, it } from "vitest";
import { getMissingAvatarAssets, resolveAvatarAsset } from "../src/data/avatarManifest";
import { getMaterialsFor } from "../src/data/demoData";
import { calculateLiteracyUpdate } from "../src/lib/ai/healthLiteracyMetrics";
import { mockGenerateYouthResponse } from "../src/lib/ai/mockProvider";
import { classifyRisk, shouldCreateParentAlert } from "../src/lib/ai/risk";
import { canAccessYouth, canViewAdminAnalytics, getDemoUserByUsername } from "../src/lib/auth/demoAuth";

describe("resi core safety and metrics", () => {
  it("smooths literacy updates", () => {
    const metric = calculateLiteracyUpdate(
      { topic: "vaping", dimension: "FUNCTIONAL", score: 40, confidence: 0.2, evidence: [] },
      "high",
      "Strong teach-back"
    );
    expect(metric.score).toBeGreaterThan(40);
    expect(metric.score).toBeLessThan(82);
    expect(metric.confidence).toBeGreaterThan(0.2);
  });

  it("classifies critical safety prompts", () => {
    const risk = classifyRisk("I want to kill myself");
    expect(risk.severity).toBe("CRITICAL");
    expect(shouldCreateParentAlert(risk.severity)).toBe(true);
  });

  it("detects AI dependency", () => {
    const risk = classifyRisk("You're the only one who understands me");
    expect(risk.riskTypes).toContain("ai_dependency");
    expect(risk.severity).toBe("HIGH");
  });

  it("keeps diagnosis and medication requests inside medical boundaries", () => {
    const dose = classifyRisk("What dose of medicine should I take?");
    const diagnosis = mockGenerateYouthResponse("Do I have anxiety if my symptoms mean panic?");
    expect(dose.riskTypes).toContain("medical_boundary");
    expect(diagnosis.riskAssessment.riskTypes).toContain("medical_boundary");
    expect(diagnosis.response).toContain("cannot diagnose");
  });

  it("escalates urgent physical danger", () => {
    const risk = classifyRisk("I can't breathe and I fainted");
    expect(risk.severity).toBe("CRITICAL");
    expect(risk.riskTypes).toContain("medical_urgency");
    expect(shouldCreateParentAlert(risk.severity)).toBe(true);
  });

  it("returns structured vaping scenario metadata", () => {
    const response = mockGenerateYouthResponse("Is vaping actually that bad if everyone does it?");
    expect(response.detectedTopics).toContain("vaping");
    expect(response.riskAssessment.severity).toBe("MODERATE");
    expect(response.quizSuggestion?.topic).toBe("vaping");
  });

  it("falls back avatar selection", () => {
    const asset = resolveAvatarAsset("Ree", "safe_escalation");
    expect(asset.id).toBe("ree_safe_escalation");
    expect(asset.missing).toBe(true);
  });

  it("reports missing required avatar assets for demo follow-up", () => {
    const missing = getMissingAvatarAssets();
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.some((asset) => asset.expectedPath.includes("ree_safe_escalation.png"))).toBe(true);
  });

  it("enforces demo access-control helpers", () => {
    const asha = getDemoUserByUsername("asha")!;
    const parent = getDemoUserByUsername("parent")!;
    const admin = getDemoUserByUsername("admin")!;
    expect(canAccessYouth(asha, "asha")).toBe(true);
    expect(canAccessYouth(asha, "nabil")).toBe(false);
    expect(canAccessYouth(parent, "nabil")).toBe(true);
    expect(canAccessYouth(admin, "asha")).toBe(false);
    expect(canViewAdminAnalytics(admin)).toBe(true);
    expect(canViewAdminAnalytics(parent)).toBe(false);
  });

  it("filters learning materials by age band and falls back to English", () => {
    const materials = getMaterialsFor("TEEN_13_15", "ta", "vaping");
    expect(materials.length).toBeGreaterThan(0);
    expect(materials.every((material) => material.ageBand === "TEEN_13_15")).toBe(true);
    expect(materials.every((material) => material.topic === "vaping")).toBe(true);
    expect(materials[0].quickExplainer).toContain("Vaping");
  });

  it("changes mock response style by age band", () => {
    const child = mockGenerateYouthResponse("Is vaping bad?", { ageBand: "CHILD_10_12" });
    const older = mockGenerateYouthResponse("Is vaping bad?", { ageBand: "OLDER_TEEN_16_18" });
    expect(child.response).toContain("simple");
    expect(older.suggestedQuickReplies).toContain("Give me a decision aid");
  });
});
