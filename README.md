# resi

resi is a youth health literacy AI associate for Singapore youth ages 10-18. It combines an avatar-led chat experience, age-specific learning modules, topic quizzes, trusted-adult conversation support, parent summaries, and aggregate admin analytics.

The product is designed around one principle: help youth learn and prepare without turning the app into a doctor, therapist, emergency service, or surveillance tool.

## Product Overview

- **Youth experience:** dashboard, educational chat, learning library, topic-specific quizzes, progress evidence, resources, and trusted-adult scripts.
- **Parent experience:** linked-youth summaries, safety alerts, and conversation guides without exposing raw youth chat transcripts by default.
- **Admin experience:** aggregate literacy and support-need trends with small-group privacy suppression.
- **Language:** English is the production demo default.
- **Avatar system:** Ree and See use manifest-driven PNG poses with SVG fallback support.

## Technical Architecture

resi is a Next.js App Router application with TypeScript, Prisma, PostgreSQL, and modular AI providers.

```text
Browser
  -> Next.js App Router pages and API routes
  -> AI orchestration layer
  -> Prisma Client
  -> Hosted PostgreSQL
```

Key modules:

- `app/`: Next.js pages and API routes.
- `components/`: shared UI, chat, quiz, admin chart, and avatar components.
- `src/lib/ai/`: chat orchestration, OpenAI adapter, mock fallback, retrieval, risk classification, and literacy scoring.
- `src/lib/data/`: DB-backed read/write helpers and chat persistence.
- `src/data/`: demo seed data and avatar manifest.
- `prisma/`: schema, migration, and seed script.

## AI And Safety

The chat pipeline combines deterministic local guardrails with an optional OpenAI provider:

1. Detect the likely health topic.
2. Retrieve matching local learning materials.
3. Classify safety and support risk.
4. Generate or fall back to an educational response.
5. Return structured metadata for avatar cues, recommendations, quiz suggestions, trusted-adult support, and health-literacy signals.

If `OPENAI_API_KEY` is missing, slow, or unavailable, resi uses the local safe response path. `OPENAI_TIMEOUT_MS` defaults to `2500` so the demo remains responsive.

Safety boundaries:

- No diagnosis, therapy, emergency response, medication dosing, or treatment plans.
- Critical-risk prompts use safety-first language and trusted-adult escalation.
- Parent views show supportive summaries and alerts, not default raw transcript access.
- Admin analytics suppress small groups to reduce re-identification risk.

## Run Locally

```bash
npm install
npm run db:generate
npm run dev
```

Open `http://localhost:3000`. If that port is busy, Next.js will choose another local port.

Useful checks:

```bash
npm run avatar:audit
npm test
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and configure only the providers you need.

Important variables:

- `DATABASE_URL`: hosted PostgreSQL connection string.
- `DIRECT_URL`: direct migration connection string when required by the database provider.
- `AI_PROVIDER=openai`: enables the OpenAI provider path when an API key is present.
- `OPENAI_API_KEY`: optional for local development; local fallback works without it.
- `OPENAI_TIMEOUT_MS=2500`: keeps chat responsive by falling back locally if the provider is slow.
- `NEXT_PUBLIC_DEMO_MODE=true`: enables demo role switching.
- `NEXT_PUBLIC_SHOW_DEMO_ROLE_SWITCHER=true`: shows quick portal switching controls.
- `DEMO_SEED_SECRET`: protects the seed endpoint or seed workflow when used in deployment.

## Deployment

The production deployment target is Vercel with hosted PostgreSQL.

Recommended setup:

1. Create a hosted PostgreSQL database.
2. Set `DATABASE_URL` and `DIRECT_URL` in Vercel.
3. Set the demo and AI environment variables listed above.
4. Run migrations and seed data.

```bash
npm run db:migrate:deploy
npm run db:seed
npm run deploy:check
```

Health checks:

- `/api/health`
- `/api/health/db`

## Demo Routes

Start at:

- `/demo`

Core routes:

- `/youth`
- `/youth/chat`
- `/youth/library`
- `/youth/library/vaping?ageBand=TEEN_13_15`
- `/youth/quiz?topic=vaping&ageBand=TEEN_13_15`
- `/youth/progress`
- `/parent`
- `/parent/asha`
- `/admin`
- `/admin/analytics`
- `/admin/content`

Optional profile comparison:

- `/demo/personalization`

## Demo Accounts

- Youth: `asha`, age 13
- Youth: `weijun`, age 16
- Youth: `nabil`, age 12
- Youth: `priya`, age 17
- Parent: `parent`
- Admin: `admin`

## Demo Walkthrough

1. Open `/demo`.
2. Click **Ask resi** and ask: “Is vaping actually that bad if everyone does it?”
3. Click **Learn safely** to show the youth dashboard, quests, progress measures, and learning route.
4. Open `/youth/library`, apply a filter, then open the vaping module.
5. Start the topic-specific quiz from the module.
6. Open `/parent/asha` to show supportive parent insight without raw chat transcripts.
7. Open `/admin/analytics` to show aggregate trends and small-group privacy suppression.

## Avatar Assets

Avatar PNGs live under `public/avatars`.

Run:

```bash
npm run avatar:audit
```

The audit verifies required Ree and See pose filenames:

- `idle`
- `wave`
- `thinking`
- `explaining`
- `pointing`
- `reading`
- `quiz`
- `celebrate`
- `concerned`
- `listening`
- `writing`
- `resource`
- `safe_escalation`

Some poses intentionally reuse the same visual asset, for example `wave`/`waving`, `listening`/`thinking`, and `safe_escalation`/`concerned`.

## Current Limitations

- Demo role switching is not production authentication.
- English is the default reviewed experience; translations are future work.
- Health content is demo content and should be reviewed before real-world deployment.
- Voice is optional and currently falls back to browser speech support.
