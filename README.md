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
- `DATABASE_URL=file:./dev.db`
- `ELEVENLABS_API_KEY` blank disables ElevenLabs voice.

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

## Features

- Demo role-switch auth with cookie-based portal protection for youth, parent, and admin routes.
- Youth portal with dashboard, chat, learning library, quiz, progress, profile, resources, and trusted-adult scripts.
- Parent portal with linked youth summaries, risk alerts, and conversation guides.
- Admin portal with aggregate analytics, content management, risk trends, and privacy settings.
- Mock AI pipeline with topic detection, retrieval, risk scoring, structured response metadata, and Nutbeam literacy signals.
- Avatar manifest in `src/data/avatarManifest.ts`.
- Prisma schema for future SQLite/PostgreSQL persistence.

## Safety Limits

resi is educational and does not provide diagnosis, therapy, emergency response, medication dosing, or treatment plans. Critical-risk prompts trigger safety-first language and trusted-adult escalation. Demo resources avoid invented hotline numbers or official policy claims.

## Future Work

- Wire Prisma Client persistence.
- Add real auth and consent flows.
- Connect OpenAI-compatible provider and reviewed RAG content.
- Add reviewed Singapore source links and complete translations.
- Add ElevenLabs API route for avatar voice.
- Add admin avatar upload/registration workflow.
