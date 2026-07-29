# Talentbank Career Fair Calendar

A career-fair calendar for Talentbank (Malaysia). Built for a 3-day hiring
challenge — see [`SPEC.md`](./SPEC.md) for the full brief and milestones.

> **Status: Milestone 1 (Skeleton).** The stack is scaffolded, the database
> schema + migration exist, and the seed script loads real 2026 Talentbank
> fairs. Public pages, registration and admin arrive in later milestones.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Drizzle ORM + Turso / libSQL (local dev uses a `file:local.db` SQLite file)
- Deploys to Vercel

## Getting started

```bash
npm install            # install dependencies
cp .env.example .env   # local defaults already point at file:local.db
npm run db:migrate     # create the tables in local.db
npm run db:seed        # load real 2026 career fairs + demo data
npm run dev            # http://localhost:3000
```

The home page shows a live count of events read from the database — proof the
Next.js → Drizzle → libSQL wiring works end to end.

## Environment variables

| Variable             | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `TURSO_DATABASE_URL` | Database URL. Local: `file:local.db`. Prod: your Turso URL.    |
| `TURSO_AUTH_TOKEN`   | Turso auth token (production only; not needed for the file DB).|
| `ADMIN_PASSCODE`     | Shared admin passcode (used from Milestone 4).                 |

## Scripts

| Command               | What it does                                    |
| --------------------- | ----------------------------------------------- |
| `npm run dev`         | Start the dev server                            |
| `npm run build`       | Production build                                |
| `npm run db:generate` | Generate a SQL migration from the schema        |
| `npm run db:migrate`  | Apply migrations to the database                |
| `npm run db:seed`     | Wipe + reload seed data (safe to re-run)        |

## Demo admin passcode

The admin side (Milestone 4) is gated by a single passcode. For reviewers the
demo value is **`talentbank2026`** — exposing it here is intentional for the
demo.
