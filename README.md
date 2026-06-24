# resi

resi is a youth health literacy AI associate for TheFirst Spark challenge hackathon, focused on Singapore youth. It helps young people ask health questions, learn through age-appropriate materials, practise quizzes, and prepare conversations with trusted adults. Parents see supportive summaries and alerts; admins see aggregate, non-identifying trends.

## Submission

- Submit the deployed Vercel URL for `/demo`.
- Submit the GitHub repo: `https://github.com/eungi-hong/resi`.
- Start the judge walkthrough from the `/demo` judge path.
- Keep `/demo/personalization` as an optional backup route if judges ask about age/profile differences.

## Run Locally

```bash
npm install
npm run db:generate
npm run dev
```

Open `http://localhost:3000`.

Optional:

```bash
npm run test
npm run db:seed
```

## Environment

Copy `.env.example` to `.env.local` and add keys only if enabling live providers. The app works without secrets by using the local safe AI fallback.

Key defaults:

- `AI_PROVIDER=openai`
- `OPENAI_API_KEY` enables live OpenAI responses.
- `OPENAI_TIMEOUT_MS=2500` keeps the demo responsive by falling back locally if the provider is slow.
- `DATABASE_URL` must point to hosted Postgres for Mode B deployment
- `ELEVENLABS_API_KEY` blank disables ElevenLabs voice

## Mode B: Hosted Postgres Deployment

The public hackathon deployment path is Mode B: hosted Postgres with Prisma. Demo data should be persisted in Postgres; chat can use OpenAI when configured and falls back locally if unavailable.

Recommended providers:

- Supabase Postgres
- Neon Postgres
- Vercel Postgres
- Any managed Postgres compatible with Prisma

Required Vercel environment variables:

- `DATABASE_URL`
- `DIRECT_URL` when the provider requires a direct migration connection
- `NEXT_PUBLIC_DEMO_MODE=true`
- `NEXT_PUBLIC_SHOW_DEMO_ROLE_SWITCHER=true`
- `AI_PROVIDER=openai`
- `NEXT_PUBLIC_ENABLE_MOCK_AI=false`
- `DEMO_SEED_SECRET`
- optional `OPENAI_API_KEY`
- optional `ELEVENLABS_API_KEY`

Deployment commands:

```bash
npm run db:migrate:deploy
npm run db:seed
npm run deploy:check
```

Health checks:

- `/api/health`
- `/api/health/db`

See [Mode B deployment docs](docs/deployment-mode-b.md), [live demo checklist](docs/live-demo-checklist.md), and [hackathon submission notes](docs/hackathon-submission.md).

## Demo Accounts

- Youth: `asha`, age 13, English
- Youth: `weijun`, age 16, English
- Youth: `nabil`, age 12, English
- Youth: `priya`, age 17, English preference
- Parent: `parent`
- Admin: `admin`

## Demo Script

1. Open `/demo`.
2. Click “Ask resi” and ask: “Is vaping actually that bad if everyone does it?”
3. Click “Learn safely” to show the youth dashboard, quests, progress measures, and learning route.
4. Open `/youth/library`, apply a filter, then open the vaping module.
5. Start the topic-specific quiz from the module or open `/youth/quiz?topic=vaping&ageBand=TEEN_13_15`.
6. Open `/parent/asha` to show supportive parent insight without raw chat transcripts.
7. Open `/admin/analytics` to show aggregate trends and small-group privacy suppression.

Direct demo routes:

- Judge path: `/demo`
- Youth: `/youth`
- Parent: `/parent`
- Admin: `/admin`
- Optional personalization demo: `/demo/personalization`

## Features

- Demo role-switch auth with cookie-based portal protection for youth, parent, and admin routes.
- Youth portal with dashboard, chat, learning library, quiz, progress, profile, resources, and trusted-adult scripts.
- Parent portal with linked youth summaries, risk alerts, and conversation guides.
- Admin portal with aggregate analytics, content management, risk trends, and privacy settings.
- OpenAI-backed youth chat with local safe fallback, topic detection, retrieval, risk scoring, structured response metadata, and Nutbeam literacy signals.
- Topic-specific learning modules and quizzes.
- Server-rendered analytics charts for a lighter production bundle.
- Avatar manifest in `src/data/avatarManifest.ts` with audited Ree/See pose filenames.
- Prisma schema and DB-backed demo persistence.

## Avatar Audit

Run:

```bash
npm run avatar:audit
```

The script lists required Ree/See PNG poses, present files, missing files, and concrete filenames to add under `public/avatars`.

## Safety Limits

resi is educational and does not provide diagnosis, therapy, emergency response, medication dosing, or treatment plans. Critical-risk prompts trigger safety-first language and trusted-adult escalation. Demo resources avoid invented hotline numbers or official policy claims.

## Future Work

- Add real auth and consent flows.
- Add reviewed Singapore source links and deeper RAG content.
- Add reviewed translations after the English demo path is approved.
- Add ElevenLabs API route for avatar voice.
- Add admin avatar upload/registration workflow.
