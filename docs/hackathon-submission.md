# Hackathon Submission

Project name: resi

One-liner: resi is a youth health literacy AI associate for Singapore that helps young people ask health questions, learn safely, and prepare trusted-adult conversations.

Problem: Youth face health misinformation, peer pressure, stigma, and unsafe AI dependence while parents and public-health stakeholders need supportive insights without violating youth privacy.

Target users:

- Youth ages 10-18
- Parents and guardians
- Public-health and education stakeholders

Solution summary:

resi combines avatar-led chat, age-specific learning modules, Nutbeam-style health literacy progress, trusted-adult scripts, parent summaries, and aggregate admin analytics.

Tools used:

- Next.js App Router
- TypeScript
- Prisma
- Hosted Postgres
- Zod
- OpenAI Responses API with local safety/retrieval guardrails

Architecture:

Next.js UI and API routes persist data through Prisma into hosted Postgres. Youth chat uses OpenAI through the provider abstraction when `OPENAI_API_KEY` is configured, with deterministic local safety, retrieval, and literacy signals. Parent and admin views read summaries and aggregates, not raw youth chat logs.

Safety architecture:

- Medical boundary guardrail
- Youth dependency detection
- High/critical support escalation
- Parent co-management level
- Admin small-group privacy suppression

Mocked vs real:

- Real: database persistence, seed data, chat history, quiz attempts, metrics, alerts, parent insights, admin content/analytics reads.
- Mocked only when no OpenAI key is configured: AI generation and voice.

Live demo routes:

- `/`
- `/demo`
- `/youth`
- `/youth/chat`
- `/youth/library`
- `/youth/library/vaping?ageBand=TEEN_13_15`
- `/youth/quiz?topic=vaping&ageBand=TEEN_13_15`
- `/parent`
- `/parent/asha`
- `/admin`
- `/admin/analytics`
- `/admin/content`

Three-minute demo script:

1. Open `/demo` and use the Judge path.
2. Click “Ask resi” and ask about vaping peer pressure.
3. Click “Learn safely” to show the youth dashboard, learning quests, and progress measures.
4. Open `/youth/library`, apply a filter, then open the vaping module and its topic-specific quiz.
5. Open `/parent/asha` and show supportive insight without raw transcript.
6. Open `/admin/analytics` and show aggregate trends with privacy suppression.
