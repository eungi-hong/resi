import { PrismaClient } from "@prisma/client";
import { avatarManifest } from "../src/data/avatarManifest";
import { demoAlerts, demoUsers, educationMaterials, initialMetrics, parentInsights, quizzes } from "../src/data/demoData";

const prisma = new PrismaClient();

async function main() {
  const seededAt = new Date();

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        role: user.role,
        name: user.name,
        demoUsername: user.demoUsername,
        languagePreference: user.languagePreference
      },
      create: {
        id: user.id,
        role: user.role,
        name: user.name,
        demoUsername: user.demoUsername,
        languagePreference: user.languagePreference
      }
    });

    if (user.role === "YOUTH") {
      await prisma.youthProfile.upsert({
        where: { userId: user.id },
        update: {
          age: user.age ?? 13,
          ageBand: user.ageBand ?? "TEEN_13_15",
          preferredName: user.name,
          avatarId: user.avatarId ?? "see_wave",
          consentStatus: "DEMO_ASSENT",
          parentVisibilityLevel: "MEDIUM",
          culturalContextNotes: "Fictional Singapore demo youth profile.",
          schoolLevel: user.age && user.age < 13 ? "Primary" : "Secondary"
        },
        create: {
          id: `profile-${user.id}`,
          userId: user.id,
          age: user.age ?? 13,
          ageBand: user.ageBand ?? "TEEN_13_15",
          preferredName: user.name,
          avatarId: user.avatarId ?? "see_wave",
          consentStatus: "DEMO_ASSENT",
          parentVisibilityLevel: "MEDIUM",
          culturalContextNotes: "Fictional Singapore demo youth profile.",
          schoolLevel: user.age && user.age < 13 ? "Primary" : "Secondary"
        }
      });
    }
  }

  const parent = demoUsers.find((user) => user.role === "PARENT")!;
  for (const youthId of parent.linkedYouthIds ?? []) {
    await prisma.parentYouthLink.upsert({
      where: { parentUserId_youthUserId: { parentUserId: parent.id, youthUserId: youthId } },
      update: { visibilityLevel: "MEDIUM" },
      create: {
        id: `link-${parent.id}-${youthId}`,
        parentUserId: parent.id,
        youthUserId: youthId,
        relationship: "guardian",
        visibilityLevel: "MEDIUM"
      }
    });
  }

  for (const material of educationMaterials) {
    await prisma.educationMaterial.upsert({
      where: { id: material.id },
      update: {
        title: material.title,
        summary: material.summary,
        content: material.content,
        readingLevel: material.readingLevel,
        literacyDimension: material.literacyDimension,
        sourceStatus: material.sourceStatus,
        reviewStatus: "SAMPLE",
        localContextNote: material.localContextNote,
        estimatedMinutes: material.estimatedMinutes,
        difficulty: material.difficulty,
        goalLabel: material.goalLabel,
        progress: material.progress ?? 0,
        whatYouLearn: material.whatYouLearn ?? [],
        quickExplainer: material.quickExplainer,
        scenario: material.scenario,
        practiceActivity: material.practiceActivity ?? [],
        mythCheck: material.mythCheck ?? {},
        trustedAdultScript: material.trustedAdultScript,
        avatarCue: material.avatarCue
      },
      create: {
        id: material.id,
        topic: material.topic,
        title: material.title,
        summary: material.summary,
        content: material.content,
        ageBand: material.ageBand,
        language: material.language,
        readingLevel: material.readingLevel,
        literacyDimension: material.literacyDimension,
        sourceStatus: material.sourceStatus,
        reviewStatus: "SAMPLE",
        localContextNote: material.localContextNote,
        estimatedMinutes: material.estimatedMinutes,
        difficulty: material.difficulty,
        goalLabel: material.goalLabel,
        progress: material.progress ?? 0,
        whatYouLearn: material.whatYouLearn ?? [],
        quickExplainer: material.quickExplainer,
        scenario: material.scenario,
        practiceActivity: material.practiceActivity ?? [],
        mythCheck: material.mythCheck ?? {},
        trustedAdultScript: material.trustedAdultScript,
        avatarCue: material.avatarCue
      }
    });

    await prisma.learningModule.upsert({
      where: { id: `module-${material.id}` },
      update: {
        title: material.title,
        sections: {
          quickExplainer: material.quickExplainer,
          scenario: material.scenario,
          practiceActivity: material.practiceActivity,
          mythCheck: material.mythCheck,
          trustedAdultScript: material.trustedAdultScript
        }
      },
      create: {
        id: `module-${material.id}`,
        educationMaterialId: material.id,
        title: material.title,
        sections: {
          quickExplainer: material.quickExplainer,
          scenario: material.scenario,
          practiceActivity: material.practiceActivity,
          mythCheck: material.mythCheck,
          trustedAdultScript: material.trustedAdultScript
        },
        orderIndex: 0
      }
    });
  }

  for (const quiz of quizzes) {
    await prisma.quiz.upsert({
      where: { id: quiz.id },
      update: {
        title: quiz.title,
        literacyDimension: quiz.literacyDimension,
        questions: quiz.questions
      },
      create: {
        id: quiz.id,
        topic: quiz.topic,
        ageBand: quiz.ageBand,
        language: quiz.language,
        title: quiz.title,
        literacyDimension: quiz.literacyDimension,
        questions: quiz.questions
      }
    });
  }

  for (const [youthUserId, metrics] of Object.entries(initialMetrics)) {
    for (const metric of metrics) {
      await prisma.healthLiteracyMetric.upsert({
        where: { youthUserId_topic_dimension: { youthUserId, topic: metric.topic, dimension: metric.dimension } },
        update: { score: metric.score, confidence: metric.confidence, evidence: metric.evidence },
        create: {
          id: `metric-${youthUserId}-${metric.topic}-${metric.dimension}`,
          youthUserId,
          topic: metric.topic,
          dimension: metric.dimension,
          score: metric.score,
          confidence: metric.confidence,
          evidence: metric.evidence
        }
      });
    }
  }

  for (const [youthUserId, insight] of Object.entries(parentInsights)) {
    await prisma.parentInsight.upsert({
      where: { id: `insight-${youthUserId}` },
      update: {
        summary: insight.summary,
        literacyStrengths: insight.strengths,
        growthAreas: insight.growthAreas,
        suggestedParentApproach: insight.approach,
        conversationStarters: insight.starters,
        riskLevel: "MODERATE"
      },
      create: {
        id: `insight-${youthUserId}`,
        youthUserId,
        summary: insight.summary,
        literacyStrengths: insight.strengths,
        growthAreas: insight.growthAreas,
        suggestedParentApproach: insight.approach,
        conversationStarters: insight.starters,
        riskLevel: "MODERATE"
      }
    });
  }

  for (const alert of demoAlerts) {
    await prisma.alert.upsert({
      where: { id: alert.id },
      update: {
        severity: alert.severity,
        title: alert.title,
        summary: alert.summary,
        recommendedActions: alert.recommendedActions,
        status: alert.status
      },
      create: {
        id: alert.id,
        youthUserId: alert.youthUserId,
        parentUserId: parent.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        summary: alert.summary,
        recommendedActions: alert.recommendedActions,
        status: alert.status
      }
    });
  }

  await prisma.conversation.upsert({
    where: { id: "conversation-asha-demo-vaping" },
    update: { updatedAt: seededAt },
    create: {
      id: "conversation-asha-demo-vaping",
      youthUserId: "asha",
      title: "Vaping and peer pressure",
      language: "en"
    }
  });
  await prisma.message.upsert({
    where: { id: "message-asha-demo-user" },
    update: {},
    create: {
      id: "message-asha-demo-user",
      conversationId: "conversation-asha-demo-vaping",
      sender: "USER",
      content: "Is vaping actually that bad if everyone does it?",
      language: "en",
      safetyLabels: { seeded: true }
    }
  });
  await prisma.message.upsert({
    where: { id: "message-asha-demo-assistant" },
    update: {},
    create: {
      id: "message-asha-demo-assistant",
      conversationId: "conversation-asha-demo-vaping",
      sender: "ASSISTANT",
      content: "If everyone around you is vaping, it can feel normal even when you are unsure. We can practise a low-drama refusal line.",
      language: "en",
      safetyLabels: { severity: "MODERATE", riskTypes: ["vaping"] },
      avatarCue: "thinking",
      metadata: { seeded: true }
    }
  });

  await prisma.riskAssessment.upsert({
    where: { id: "risk-asha-vaping-seeded" },
    update: {},
    create: {
      id: "risk-asha-vaping-seeded",
      youthUserId: "asha",
      topic: "vaping",
      riskType: "peer_pressure",
      severity: "MODERATE",
      score: 56,
      rationale: "Seeded demo scenario showing peer pressure around vaping.",
      evidenceMessageIds: ["message-asha-demo-user"],
      recommendedAction: "Offer a supportive conversation and practise refusal scripts.",
      parentAlertRecommended: false
    }
  });

  for (const material of educationMaterials.slice(0, 12)) {
    await prisma.adminAggregateSnapshot.upsert({
      where: { id: `snapshot-${material.topic}-${material.ageBand}-${material.language}` },
      update: {
        averageFunctionalScore: 64,
        averageInteractiveScore: 52,
        averageCriticalScore: 47,
        riskCounts: { LOW: 8, MODERATE: 4, HIGH: 1 },
        materialEngagement: { views: 24, quizAttempts: 8, completions: 5 }
      },
      create: {
        id: `snapshot-${material.topic}-${material.ageBand}-${material.language}`,
        date: seededAt,
        ageBand: material.ageBand,
        language: material.language,
        topic: material.topic,
        averageFunctionalScore: 64,
        averageInteractiveScore: 52,
        averageCriticalScore: 47,
        riskCounts: { LOW: 8, MODERATE: 4, HIGH: 1 },
        materialEngagement: { views: 24, quizAttempts: 8, completions: 5 }
      }
    });
  }

  for (const asset of avatarManifest) {
    await prisma.avatarAsset.upsert({
      where: { id: asset.id },
      update: {
        filePath: asset.filePath,
        expectedPath: asset.expectedPath,
        missing: asset.missing,
        recommendedContexts: asset.recommendedContexts
      },
      create: {
        id: asset.id,
        characterName: asset.characterName,
        displayName: asset.displayName,
        genderPresentation: asset.genderPresentation,
        agePresentation: asset.agePresentation,
        pose: asset.pose,
        emotion: asset.emotion,
        action: asset.action,
        filePath: asset.filePath,
        expectedPath: asset.expectedPath,
        altText: asset.altText,
        recommendedContexts: asset.recommendedContexts,
        missing: asset.missing
      }
    });
  }

  await prisma.auditLog.create({
    data: {
      id: `audit-seed-${Date.now()}`,
      actorUserId: "admin",
      action: "DEMO_SEED",
      entityType: "database",
      entityId: "mode-b-demo",
      metadata: { seededAt, version: "mode-b-2026-06-24" }
    }
  });

  console.log("resi Mode B demo seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
