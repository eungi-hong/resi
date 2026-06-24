# resi Architecture

resi is a Next.js App Router MVP with three portals:

- Youth: dashboard, OpenAI-backed chat, library, quizzes, progress, profile, trusted-adult tools.
- Parent: summary-based linked-youth insights, alerts, and conversation guides.
- Admin: aggregate analytics, content management, risk trends, and governance settings.

The AI layer is modular:

- `src/lib/ai/orchestrator.ts` runs the pipeline.
- `openaiProvider.ts` calls the OpenAI Responses API when configured.
- `mockProvider.ts` is the no-key fallback.
- `risk.ts` classifies youth-specific risk.
- `healthLiteracyMetrics.ts` implements Nutbeam-style scoring helpers.
- `retrieval.ts` retrieves local education material.
- `schemas.ts` validates structured AI output with Zod.

Data is currently in `src/data/demoData.ts` for reliable hackathon demos. `prisma/schema.prisma` mirrors the intended persistent model and can be wired to SQLite/PostgreSQL later.
