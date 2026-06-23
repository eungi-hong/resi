# resi

resi is a youth health literacy AI associate for TheFirst Spark challenge hackathon, focused on Singapore youth. It helps young people ask health questions, learn through age-appropriate materials, practise quizzes, and prepare conversations with trusted adults. Parents see supportive summaries and alerts; admins see aggregate, non-identifying trends.

## Assumptions

- MVP age range: 10-18.
- Demo role-switching auth, not production auth.
- Mock AI runs by default; no API keys are required.
- ElevenLabs voice is optional and disabled unless keys are provided.
- Mobbin MCP was used for UI research: Gemini/Pi/Alan chat patterns, Bloom/Duolingo learning progression, ClassDojo-style parent progress cards, and Canny/Steep/Mailchimp-style admin analytics.
- Avatar assets are placeholder SVGs and manifest-driven.
- Parent visibility defaults to summaries plus selected safety alerts.

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

Copy `.env.example` to `.env.local` and add keys only if enabling live providers. The app works in mocked mode without secrets.

Key defaults:

- `RESI_AI_PROVIDER=mock`
- `AI_PROVIDER=mock`
- `DATABASE_URL` must point to hosted Postgres for Mode B deployment
- `ELEVENLABS_API_KEY` blank disables ElevenLabs voice.

## Mode B: Hosted Postgres Deployment

The public hackathon deployment path is Mode B: hosted Postgres with Prisma. The app still supports mock AI and text-only voice fallback, but production demo data should be persisted in Postgres.

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
- `AI_PROVIDER=mock`
- `NEXT_PUBLIC_ENABLE_MOCK_AI=true`
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

- Youth: `asha`, age 13, English/Tamil preference
- Youth: `weijun`, age 16, English/Mandarin preference
- Youth: `nabil`, age 12, English/Malay preference
- Youth: `priya`, age 17, English preference
- Parent: `parent`
- Admin: `admin`

## Demo Script

1. Go to `/login` and choose Asha.
2. Open `/youth/chat`.
3. Try: “Is vaping actually that bad if everyone does it?”
4. See the adaptive response, avatar cue, recommended material, quiz suggestion, and risk metadata.
5. Open `/youth/quiz` and complete the quiz.
6. Open `/youth/progress` to see literacy evidence.
7. Open `/parent` and `/parent/asha` to see summaries and alerts.
8. Open `/admin` and `/admin/analytics` to see aggregate trends.
9. Open `/demo/personalization` to switch youth profiles and compare age-band differences.

Direct demo routes:

- Youth: `/youth`
- Parent: `/parent`
- Admin: `/admin`
- Demo: `/demo`
- Personalization demo: `/demo/personalization`

## Features

- Demo role-switch auth with cookie-based portal protection for youth, parent, and admin routes.
- Youth portal with dashboard, chat, learning library, quiz, progress, profile, resources, and trusted-adult scripts.
- Parent portal with linked youth summaries, risk alerts, and conversation guides.
- Admin portal with aggregate analytics, content management, risk trends, and privacy settings.
- Mock AI pipeline with topic detection, retrieval, risk scoring, structured response metadata, and Nutbeam literacy signals.
- Avatar manifest in `src/data/avatarManifest.ts`.
- Prisma schema for future SQLite/PostgreSQL persistence.

## Avatar Audit

Run:

```bash
npm run avatar:audit
```

The script lists required Ree/See PNG poses, present files, missing files, and concrete suggested filenames to upload.

## Safety Limits

resi is educational and does not provide diagnosis, therapy, emergency response, medication dosing, or treatment plans. Critical-risk prompts trigger safety-first language and trusted-adult escalation. Demo resources avoid invented hotline numbers or official policy claims.

## Future Work

- Wire Prisma Client persistence.
- Add real auth and consent flows.
- Connect OpenAI-compatible provider and reviewed RAG content.
- Add reviewed Singapore source links and complete translations.
- Add ElevenLabs API route for avatar voice.
- Add admin avatar upload/registration workflow.
