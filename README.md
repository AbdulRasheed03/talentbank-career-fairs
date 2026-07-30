# Talentbank Career Fair Calendar

A career-fair calendar for Talentbank (Malaysia). Built for a 3-day hiring
challenge — see [`SPEC.md`](./SPEC.md) for the full brief.

**Live demo:** https://talentbank-career-fairs.vercel.app
**Admin:** https://talentbank-career-fairs.vercel.app/admin (passcode below)

The public side lists every 2026 fair grouped by month, with an event page for
registration (confirmed / waitlist / duplicate handling). The passcode-gated
admin side manages events: create/edit with clash warnings, soft-cancel with a
reason, capacity raises that promote the waitlist, a registrants view with CSV
export, and an outbox of the notifications that would have been emailed.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
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

Open `http://localhost:3000` for the public site and
`http://localhost:3000/admin` for the admin side.

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
- **Admin auth is one shared passcode** in an httpOnly cookie, checked by
  middleware. A deliberate simplification (no user accounts) — noted in code.
- **Notifications are an "outbox", not real email.** Cancelling, moving dates,
  and promoting the waitlist all write rows that would have been sent; the
  `/admin/outbox` page shows them.

## Demo admin passcode

The admin side is gated by a single passcode. For reviewers the demo value is
**`talentbank2026`** — exposing it here is intentional for the demo.
