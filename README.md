# Talentbank Career Fair Calendar

A career-fair calendar for Talentbank (Malaysia). Built for a 3-day hiring
challenge — see [`SPEC.md`](./SPEC.md) for the full brief.

**Live demo:** https://talentbank-career-fairs.vercel.app
**Sign in:** https://talentbank-career-fairs.vercel.app/login (demo accounts below)

`/` is an editorial marketing landing (talentbank.io-inspired). The calendar
lives at `/events`: every 2026 fair grouped by month; visitors log in or create
an account to register for one (confirmed / waitlist / duplicate handling). The
admin side — a single seeded account — manages events: create/edit with clash
warnings, soft-cancel with a reason, capacity raises that promote the waitlist,
a registrants view with CSV export, and an outbox of the notifications that
would have been emailed.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Fraunces + Inter via `next/font`; Framer Motion + Lenis power the marketing landing
- Drizzle ORM + Turso / libSQL (local dev uses a `file:local.db` SQLite file)
- Deploys to Vercel; the production database is Turso

## Getting started

```bash
npm install            # install dependencies
cp .env.example .env    # local defaults already point at file:local.db
npm run db:migrate      # create the tables in local.db
npm run db:seed         # load real 2026 career fairs + demo data
npm run dev             # http://localhost:3000
```

Key routes:

- `/` — marketing landing
- `/events` — the 2026 career-fair calendar
- `/login` · `/register` — accounts (the admin lands in the dashboard)
- `/admin/*` — admin (passcode-free; the seeded admin account)

## Environment variables

| Variable             | Purpose                                                         |
| -------------------- | --------------------------------------------------------------- |
| `TURSO_DATABASE_URL` | Database URL. Local: `file:local.db`. Prod: your Turso URL.     |
| `TURSO_AUTH_TOKEN`   | Turso auth token (production only; not needed for the file DB). |
| `ADMIN_PASSCODE`     | Shared passcode that unlocks `/admin`.                          |

## Scripts

| Command               | What it does                             |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start the dev server                     |
| `npm run build`       | Production build                         |
| `npm test`            | Run the unit tests (Node test runner)    |
| `npm run db:generate` | Generate a SQL migration from the schema |
| `npm run db:migrate`  | Apply migrations to the database         |
| `npm run db:seed`     | Wipe + reload seed data (safe to re-run) |

## Tests

```bash
npm test
```

Deliberately small and focused on the logic that matters: the capacity/waitlist
decision, clash detection, date formatting/arithmetic, derived event status,
form validation, and the shape of the seed data. Pure functions, no database —
fast and non-flaky.

## Key decisions

- **Dates are plain `YYYY-MM-DD` text, Malaysia time implicit** — never parsed
  with `new Date("YYYY-MM-DD")` (that shifts to UTC and can move the day). They
  are compared/sorted as strings and formatted by hand.
- **Derived state is never stored.** `isFull`, `isPast` and the status chip are
  computed; registration counts are always counted from the `registrations`
  table. One source of truth, no sync bugs.
- **Registration runs in a transaction** — recount confirmed, then confirm or
  waitlist. A unique `(eventId, email)` index turns a double sign-up into a
  friendly message instead of a crash.
- **Real accounts with role-based access.** Visitors self-register as `user`;
  a single seeded `admin` account manages events. Passwords are scrypt-hashed;
  a signed httpOnly session cookie is verified in middleware so visitors can't
  reach `/admin` and the admin is kept out of the public site.
- **Notifications are an "outbox", not real email.** Cancelling, moving dates,
  and promoting the waitlist all write rows that would have been sent; the
  `/admin/outbox` page shows them.

## Demo accounts

Sign in at `/login`. Exposed on purpose so reviewers can try both sides:

| Role  | Username | Password         |
| ----- | -------- | ---------------- |
| Admin | `admin`  | `talentbank2026` |
| User  | `demo`   | `demo12345`      |

Or create your own public account at `/register`. The admin account can only be
seeded — it can never be created through the register form.
