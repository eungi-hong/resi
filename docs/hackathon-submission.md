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
- Recharts
- Zod
- Mock AI provider with OpenAI-compatible adapter placeholder

Architecture:

Next.js UI and API routes persist data through Prisma into hosted Postgres. Mock or live AI runs through the provider abstraction. Parent and admin views read summaries and aggregates, not raw youth chat logs.

Safety architecture:

- Medical boundary guardrail
- Youth dependency detection
- High/critical support escalation
- Parent co-management level
- Admin small-group privacy suppression

Mocked vs real:

- Real: database persistence, seed data, chat history, quiz attempts, metrics, alerts, parent insights, admin content/analytics reads.
- Mocked by default: AI generation and voice.

Live demo routes:

- `/`
- `/demo/personalization`
- `/youth`
- `/youth/chat`
- `/youth/library`
- `/parent`
- `/parent/asha`
- `/admin`
- `/admin/analytics`
- `/admin/content`

Three-minute demo script:

1. Open `/demo/personalization` and switch from Nabil to Asha to Wei Jun.
2. Open `/youth/chat` and ask about vaping peer pressure.
3. Refresh chat to show persistence.
4. Open `/youth/library/vaping` and show age-specific structured learning.
5. Open `/parent/asha` and show supportive insight without raw transcript.
6. Open `/admin/analytics` and show aggregate trends with privacy suppression.
