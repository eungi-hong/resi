# resi — Youth Health Literacy AI Associate

> A context-aware, emotionally intelligent, self-adaptive AI agent empowering Singapore youth (ages 10–18) to build genuine health literacy — not dependency, not fear.

---

## What is resi?

**resi** is a youth health literacy AI agent built specifically for adolescents in Singapore. Unlike general-purpose health AI agents, resi is designed around the unique vulnerabilities of young people: the risk of overreliance, exposure to misinformation, and the stunted development of real-world health communication skills.

The product is built around one principle: **help youth learn and prepare without turning the app into a doctor, therapist, emergency service, or surveillance tool.**

resi targets four health areas with the most significant literacy gaps among Singaporean youth:

| Health Domain | The Gap |
|---|---|
| Vaping & Smoking | 55% of youth perceive vaping as socially acceptable despite national education campaigns |
| Diabetes & Obesity | Youth disengage from population-level messaging ("invincibility gap") |
| Screen Time & Social Media | MOH guidance and school programmes show limited effect |
| Mental Health | Youth turn to unvetted online tools for self-diagnosis, risking harmful misinformation |

---

## How the Agent Works

resi's core is a **stateful agentic loop** — not a simple prompt-response AI agent. Every conversation feeds into a persistent health literacy model for each user, which the agent uses to adapt its educational approach in real time.

```
User Input
    │
    ├── 1. Topic detection (health domain classification)
    ├── 2. Local learning material retrieval
    ├── 3. Safety & support-need risk classification
    │
    ▼
AI Orchestration Layer (src/lib/ai/)
    │
    ├── OpenAI provider (with 2500ms timeout + local fallback)
    │
    └── Structured response with:
        ├── Avatar cues (emotional state signalling)
        ├── Recommended learning materials
        ├── Quiz suggestions
        ├── Trusted-adult conversation scripts
        └── Health literacy signals → persistent scoring
    │
    ▼
Persistent Health Literacy Model (per user, DB-backed)
    │
    ├── Functional HL: factual knowledge state
    ├── Interactive HL: personal skill development
    └── Critical HL: autonomy & empowerment level
```

### Agent Capabilities

| Capability | Implementation |
|---|---|
| **Persistent health literacy scoring** | Per-user HL model updated after every interaction, mapped to Nutbeam's three-tier framework |
| **Self-adaptive content** | Learning materials and conversational nuance adjust to current HL level and age band |
| **Vulnerability triage** | Risk classifier identifies support-need signals; high-risk prompts use safety-first language and escalation |
| **Trusted-adult scaffolding** | Agent generates conversation scripts to help youth initiate discussions with parents/counsellors |
| **Automatic parent alerts** | Safety alerts surface to parent view without exposing raw chat transcripts |
| **Avatar emotional signalling** | 13-pose avatar system (Ree & See) reflects the agent's conversational state |
| **Local fallback** | If OpenAI is unavailable or slow, the agent routes to the deterministic local safe-response path |

---

## Safety Design

resi's safety architecture is purpose-built for adolescents:

- **No diagnosis, therapy, or treatment plans** — the agent will not act as a medical or mental health provider
- **No emergency response** — critical-risk prompts escalate to trusted-adult language and real-world resources
- **No raw transcript exposure** — parents see supportive summaries and alerts, not default access to youth chat logs
- **No small-group re-identification** — admin analytics suppress results below the privacy threshold
- **Guardrails-first pipeline** — local safety classification runs before any LLM call; the OpenAI provider is optional and time-bounded

---

## Product Overview

**Youth** — Dashboard, educational chat with Ree/See avatars, learning library (topic + age-band filtered), topic quizzes, progress evidence, external resources, and trusted-adult conversation scripts.

**Parent** — Linked-youth summaries, safety alerts, and conversation guides. Raw chat transcripts are not exposed by default.

**Admin** — Aggregate health literacy and support-need trends with small-group privacy suppression.

---

## Technical Architecture

resi is a **Next.js App Router** application with TypeScript, Prisma, and PostgreSQL, with a modular AI provider layer.

```
Browser
  → Next.js App Router (pages + API routes)
  → AI orchestration layer (src/lib/ai/)
  → Prisma Client
  → Hosted PostgreSQL
```

**Key modules:**

| Module | Purpose |
|---|---|
| `app/` | Next.js pages and API routes |
| `components/` | Shared UI, chat, quiz, admin charts, avatar components |
| `src/lib/ai/` | Chat orchestration, OpenAI adapter, mock fallback, retrieval, risk classification, literacy scoring |
| `src/lib/data/` | DB-backed read/write helpers and chat persistence |
| `src/data/` | Demo seed data and avatar manifest |
| `prisma/` | Schema, migrations, seed script |

---

## Run Locally

```bash
npm install
npm run db:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is busy, Next.js will choose another.

```bash
npm run avatar:audit   # verify avatar pose assets
npm test               # run test suite
npm run build          # production build check
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure the providers you need.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Hosted PostgreSQL connection string |
| `DIRECT_URL` | Direct migration connection string (required by some providers) |
| `RESI_USE_DATABASE=true` | Opt into DB-backed reads/writes (leave unset for seeded demo mode) |
| `AI_PROVIDER=openai` | Enables OpenAI provider when API key is present |
| `OPENAI_API_KEY` | Optional for local dev — local fallback works without it |
| `OPENAI_TIMEOUT_MS=9000` | Falls back to local path if provider is slow |
| `NEXT_PUBLIC_DEMO_MODE=true` | Enables demo role switching |
| `NEXT_PUBLIC_SHOW_DEMO_ROLE_SWITCHER=true` | Shows quick portal switching controls |
| `DEMO_SEED_SECRET` | Protects the seed endpoint in deployment |

---

## Deployment

Production target is **Vercel**. The public demo runs from bundled seed data for fast, stable page loads; hosted PostgreSQL is available for persistent deployments.

```bash
# After setting DATABASE_URL, DIRECT_URL, and other env vars in Vercel:
npm run db:migrate:deploy
npm run db:seed
npm run deploy:check
```

Health check endpoints: `/api/health` and `/api/health/db`

---

## Demo

Start at `/demo`, or jump directly to any route:

```
/youth                              # Youth dashboard
/youth/chat                         # Chat with Ree/See
/youth/library                      # Learning library
/youth/library/vaping?ageBand=TEEN_13_15
/youth/quiz?topic=vaping&ageBand=TEEN_13_15
/youth/progress                     # Health literacy progress
/parent/asha                        # Parent view (no raw transcripts)
/admin/analytics                    # Aggregate trends + privacy suppression
/demo/personalization               # Profile comparison
```

**Demo accounts:**

| Portal | Username | Age |
|---|---|---|
| Youth | asha | 13 |
| Youth | weijun | 16 |
| Youth | nabil | 12 |
| Youth | priya | 17 |
| Parent | parent | — |
| Admin | admin | — |

**Suggested walkthrough:**

1. Open `/demo`
2. Click **Ask resi** → ask: *"Is vaping actually that bad if everyone does it?"*
3. Click **Learn safely** → youth dashboard, quests, progress, learning route
4. Open `/youth/library`, apply a filter, open the vaping module
5. Start the topic quiz from within the module
6. Open `/parent/asha` → supportive parent insight without raw transcripts
7. Open `/admin/analytics` → aggregate trends and privacy suppression in action

---

## Avatar System

Ree and See are manifest-driven with PNG poses and SVG fallback. Required poses:

`idle` · `wave` · `thinking` · `explaining` · `pointing` · `reading` · `quiz` · `celebrate` · `concerned` · `listening` · `writing` · `resource` · `safe_escalation`

Assets live under `public/avatars/`. Run `npm run avatar:audit` to verify all required filenames are present.

---

## Current Limitations

- Demo role switching is not production authentication
- English is the default reviewed experience; translations are future work
- Health content is demo content and should be reviewed before real-world deployment
- Voice is optional and currently falls back to browser speech support

---

## Theoretical Grounding

resi's health literacy metrics are built on **Nutbeam's three-tier model**:

1. **Functional** — Transmitting accurate, accessible factual information on health risks
2. **Interactive** — Developing personal skills and health agency through guided conversation
3. **Critical** — Building capacity for autonomous health decision-making and community empowerment

The agent tracks and targets all three levels simultaneously, adapting emphasis based on each user's current profile.

---

*resi is a youth health literacy AI associate. It is not a medical device and does not provide clinical diagnoses, treatment recommendations, or emergency services.*