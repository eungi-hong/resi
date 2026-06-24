# resi Mode B Deployment

Mode B uses hosted Postgres as the source of truth for demo data and live interactions.

Architecture:

Browser -> Next.js App Router on Vercel -> OpenAI Responses API + Prisma Client -> Hosted Postgres

OpenAI generates the youth-facing chat response when `OPENAI_API_KEY` is configured. Local deterministic topic detection, risk assessment, retrieval, and literacy signals still shape the response and persistence. If OpenAI is temporarily unavailable, chat falls back to a local safe response so the live demo does not break. Chat messages, assistant responses, risk assessments, health literacy updates, parent insights, alerts, quiz attempts, education materials, and admin snapshots persist in Postgres.

## Provider Setup

Use Supabase Postgres, Neon, Vercel Postgres, or another managed Postgres provider that supports Prisma.

Set:

- `DATABASE_URL`: pooled runtime connection string when available.
- `DIRECT_URL`: direct non-pooled connection string for Prisma migrations when the provider requires it.

For Neon and Supabase, use the pooled URL for app runtime and the direct URL for migrations if your plan exposes both.

## Migration Workflow

Local development:

```bash
npm install
npm run db:generate
npm run db:migrate:dev
```

Production/staging:

```bash
npm run db:migrate:deploy
```

Do not use `prisma db push` as the production workflow. Do not reset production data.

## Seed Workflow

Seed is idempotent and safe to rerun:

```bash
npm run db:seed
```

The seed creates fictional youth, parents, admin, learning materials, quizzes, metrics, demo chat history, risk assessments, parent insights, alerts, admin aggregate snapshots, and avatar metadata.

## Vercel Workflow

1. Connect `eungi-hong/resi` to Vercel.
2. Framework preset: Next.js.
3. Set environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_DEMO_MODE=true`
   - `NEXT_PUBLIC_SHOW_DEMO_ROLE_SWITCHER=true`
   - `AI_PROVIDER=openai`
   - `OPENAI_API_KEY`
   - `OPENAI_BASE_URL=https://api.openai.com/v1`
   - `OPENAI_MODEL=gpt-4.1-mini`
   - `NEXT_PUBLIC_ENABLE_MOCK_AI=false` for the UI flag; server chat still has a safe fallback
   - `DEMO_SEED_SECRET`
   - optional `ELEVENLABS_API_KEY`
4. Run `npm run db:migrate:deploy`.
5. Run `npm run db:seed`.
6. Deploy.
7. Verify `/api/health` and `/api/health/db`.

## Rollback Notes

If a deployment fails before migration, redeploy the previous Vercel build. If a migration was applied, create a forward fix migration rather than resetting data.

## Known Limitations

Auth is demo role-switch auth, not production identity. If `OPENAI_API_KEY` is missing, the app falls back to local mock AI so the demo does not hard-crash. Some avatar PNG poses are still missing and fall back to SVG or placeholder assets.
