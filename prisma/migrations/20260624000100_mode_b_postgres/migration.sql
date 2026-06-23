-- CreateEnum
CREATE TYPE "Role" AS ENUM ('YOUTH', 'PARENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "AgeBand" AS ENUM ('CHILD_10_12', 'TEEN_13_15', 'OLDER_TEEN_16_18');

-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "LiteracyDimension" AS ENUM ('FUNCTIONAL', 'INTERACTIVE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('NONE', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SourceStatus" AS ENUM ('SAMPLE', 'UNVERIFIED', 'OFFICIAL_REVIEWED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('SAMPLE', 'DRAFT', 'NEEDS_REVIEW', 'REVIEWED');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "demoUsername" TEXT NOT NULL,
    "languagePreference" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YouthProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "ageBand" "AgeBand" NOT NULL,
    "preferredName" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "consentStatus" TEXT NOT NULL,
    "parentVisibilityLevel" TEXT NOT NULL,
    "culturalContextNotes" TEXT,
    "schoolLevel" TEXT,
    "voiceId" TEXT,
    "interactionStyle" TEXT NOT NULL DEFAULT 'calm',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YouthProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentYouthLink" (
    "id" TEXT NOT NULL,
    "parentUserId" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "visibilityLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentYouthLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "sender" "Sender" NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "safetyLabels" JSONB NOT NULL,
    "avatarCue" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthContext" (
    "id" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "socioculturalFactors" JSONB NOT NULL,
    "knownConcerns" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthLiteracyMetric" (
    "id" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "dimension" "LiteracyDimension" NOT NULL,
    "score" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "evidence" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthLiteracyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "score" INTEGER NOT NULL,
    "rationale" TEXT NOT NULL,
    "evidenceMessageIds" JSONB NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "parentAlertRecommended" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "parentUserId" TEXT,
    "type" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "recommendedActions" JSONB NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentInsight" (
    "id" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "literacyStrengths" JSONB NOT NULL,
    "growthAreas" JSONB NOT NULL,
    "suggestedParentApproach" TEXT NOT NULL,
    "conversationStarters" JSONB NOT NULL,
    "riskLevel" "Severity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationMaterial" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ageBand" "AgeBand" NOT NULL,
    "language" TEXT NOT NULL,
    "readingLevel" TEXT NOT NULL,
    "literacyDimension" "LiteracyDimension" NOT NULL,
    "sourceUrl" TEXT,
    "sourceStatus" "SourceStatus" NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'SAMPLE',
    "reviewedBy" TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "localContextNote" TEXT,
    "estimatedMinutes" INTEGER,
    "difficulty" TEXT,
    "goalLabel" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "whatYouLearn" JSONB,
    "quickExplainer" TEXT,
    "scenario" TEXT,
    "practiceActivity" JSONB,
    "mythCheck" JSONB,
    "trustedAdultScript" TEXT,
    "avatarCue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningModule" (
    "id" TEXT NOT NULL,
    "educationMaterialId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "ageBand" "AgeBand" NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "literacyDimension" "LiteracyDimension" NOT NULL,
    "questions" JSONB NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "literacyUpdates" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamificationState" (
    "id" TEXT NOT NULL,
    "youthUserId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "streakDays" INTEGER NOT NULL,
    "badges" JSONB NOT NULL,
    "completedQuests" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GamificationState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAggregateSnapshot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ageBand" "AgeBand" NOT NULL,
    "language" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "averageFunctionalScore" DOUBLE PRECISION NOT NULL,
    "averageInteractiveScore" DOUBLE PRECISION NOT NULL,
    "averageCriticalScore" DOUBLE PRECISION NOT NULL,
    "riskCounts" JSONB NOT NULL,
    "materialEngagement" JSONB NOT NULL,

    CONSTRAINT "AdminAggregateSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarAsset" (
    "id" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "genderPresentation" TEXT NOT NULL,
    "agePresentation" TEXT NOT NULL,
    "pose" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "expectedPath" TEXT,
    "altText" TEXT NOT NULL,
    "recommendedContexts" JSONB NOT NULL,
    "missing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvatarAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_demoUsername_key" ON "User"("demoUsername");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_demoUsername_idx" ON "User"("demoUsername");

-- CreateIndex
CREATE UNIQUE INDEX "YouthProfile_userId_key" ON "YouthProfile"("userId");

-- CreateIndex
CREATE INDEX "YouthProfile_ageBand_idx" ON "YouthProfile"("ageBand");

-- CreateIndex
CREATE INDEX "ParentYouthLink_parentUserId_idx" ON "ParentYouthLink"("parentUserId");

-- CreateIndex
CREATE INDEX "ParentYouthLink_youthUserId_idx" ON "ParentYouthLink"("youthUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentYouthLink_parentUserId_youthUserId_key" ON "ParentYouthLink"("parentUserId", "youthUserId");

-- CreateIndex
CREATE INDEX "Conversation_youthUserId_updatedAt_idx" ON "Conversation"("youthUserId", "updatedAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "HealthContext_youthUserId_idx" ON "HealthContext"("youthUserId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthContext_youthUserId_topic_key" ON "HealthContext"("youthUserId", "topic");

-- CreateIndex
CREATE INDEX "HealthLiteracyMetric_youthUserId_topic_dimension_idx" ON "HealthLiteracyMetric"("youthUserId", "topic", "dimension");

-- CreateIndex
CREATE UNIQUE INDEX "HealthLiteracyMetric_youthUserId_topic_dimension_key" ON "HealthLiteracyMetric"("youthUserId", "topic", "dimension");

-- CreateIndex
CREATE INDEX "RiskAssessment_youthUserId_severity_createdAt_idx" ON "RiskAssessment"("youthUserId", "severity", "createdAt");

-- CreateIndex
CREATE INDEX "RiskAssessment_topic_severity_createdAt_idx" ON "RiskAssessment"("topic", "severity", "createdAt");

-- CreateIndex
CREATE INDEX "Alert_youthUserId_status_severity_idx" ON "Alert"("youthUserId", "status", "severity");

-- CreateIndex
CREATE INDEX "Alert_parentUserId_status_idx" ON "Alert"("parentUserId", "status");

-- CreateIndex
CREATE INDEX "ParentInsight_youthUserId_updatedAt_idx" ON "ParentInsight"("youthUserId", "updatedAt");

-- CreateIndex
CREATE INDEX "EducationMaterial_topic_ageBand_language_sourceStatus_idx" ON "EducationMaterial"("topic", "ageBand", "language", "sourceStatus");

-- CreateIndex
CREATE INDEX "EducationMaterial_reviewStatus_idx" ON "EducationMaterial"("reviewStatus");

-- CreateIndex
CREATE INDEX "LearningModule_educationMaterialId_idx" ON "LearningModule"("educationMaterialId");

-- CreateIndex
CREATE INDEX "Quiz_topic_ageBand_language_idx" ON "Quiz"("topic", "ageBand", "language");

-- CreateIndex
CREATE INDEX "QuizAttempt_youthUserId_createdAt_idx" ON "QuizAttempt"("youthUserId", "createdAt");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_idx" ON "QuizAttempt"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "GamificationState_youthUserId_key" ON "GamificationState"("youthUserId");

-- CreateIndex
CREATE INDEX "AdminAggregateSnapshot_date_topic_ageBand_language_idx" ON "AdminAggregateSnapshot"("date", "topic", "ageBand", "language");

-- CreateIndex
CREATE INDEX "AvatarAsset_characterName_pose_idx" ON "AvatarAsset"("characterName", "pose");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "YouthProfile" ADD CONSTRAINT "YouthProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentYouthLink" ADD CONSTRAINT "ParentYouthLink_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentYouthLink" ADD CONSTRAINT "ParentYouthLink_youthUserId_fkey" FOREIGN KEY ("youthUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_youthUserId_fkey" FOREIGN KEY ("youthUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthLiteracyMetric" ADD CONSTRAINT "HealthLiteracyMetric_youthUserId_fkey" FOREIGN KEY ("youthUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_youthUserId_fkey" FOREIGN KEY ("youthUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_youthUserId_fkey" FOREIGN KEY ("youthUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentInsight" ADD CONSTRAINT "ParentInsight_youthUserId_fkey" FOREIGN KEY ("youthUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningModule" ADD CONSTRAINT "LearningModule_educationMaterialId_fkey" FOREIGN KEY ("educationMaterialId") REFERENCES "EducationMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

