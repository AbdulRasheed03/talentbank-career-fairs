# SPEC — Talentbank Career Fair Calendar (Hiring Prototype)

## Context (read first)

This is a 3-day hiring challenge prototype for Talentbank (Malaysian recruitment company, runs ~50 career fairs a year — see talentbank.io/career-fairs). Reviewers are a mix of technical and HR people. The author must explain every part of this codebase on video, so:

- **Boring, readable code beats clever code.** No magic abstractions, no premature generalisation.
- Prefer explicit logic in well-named functions (`detectClashes`, `registerForEvent`) over inline complexity.
- Work **one milestone at a time** (see bottom). Finish, run, verify, stop. Do not jump ahead.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Drizzle ORM + Turso (libSQL). Local dev: `file:local.db`. Production: Turso free tier via `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.
- Deploy: Vercel. No other services.

## Data model

**events**
- `id` (pk), `slug` (unique), `title`
- `startDate`, `endDate` — **plain `YYYY-MM-DD` text.** All dates are Malaysia time, implicit. Never parse with `new Date("YYYY-MM-DD")` (UTC shift bug). Compare/sort as strings; format for display manually.
- `timeLabel` — display-only text, e.g. `"10:00 AM – 5:00 PM"`
- `venue`, `city`, `description`
- `capacity` (int)
- `status`: `'scheduled' | 'cancelled'`
- `cancellationReason` (nullable), `createdAt`, `updatedAt`

**registrations**
- `id`, `eventId` (fk), `name`, `email`, `attendeeType`: `'candidate' | 'employer'`
- `status`: `'confirmed' | 'waitlisted'`
- `createdAt`
- **Unique constraint on `(eventId, email)`** — duplicate signups get a friendly error, not a crash.

**notifications** (the "outbox")
- `id`, `eventId`, `recipientEmail`, `message`, `createdAt`
- Rows are written but never sent. This is a deliberate stub for email.

**Derived state — never stored:** `isFull` = confirmed count ≥ capacity. `isPast` = endDate < today. Single source of truth; no sync bugs.

## Business rules (the actual assignment)

1. **Clash detection.** Two `scheduled` events clash when city matches (case-insensitive) AND date ranges overlap. On admin create/edit, show a **non-blocking warning banner** naming the clashing event ("Clashes with *KL Mega Career Fair*, 14–15 Mar, Kuala Lumpur"). Warn, don't block — running two events can be intentional. Show a small "clash" chip in the admin list too.
2. **Cancellation is soft.** Cancel sets `status='cancelled'` + reason. Registrations are kept. Write one outbox row per confirmed registrant ("Event cancelled: …"). Public page keeps the event visible with a clear Cancelled banner; registration disabled. **Never hard-delete events.**
3. **Moving an event** = editing its dates. If it has registrants, write outbox rows ("Date changed: 14 Mar → 21 Mar"). People plan their week around this calendar — a silent move is a bug.
4. **Capacity.** Registration runs in a transaction: recount confirmed registrations, if at capacity create the registration as `waitlisted` and tell the user honestly; otherwise `confirmed`. Full events show a capacity bar and "Join waitlist" instead of "Register".
5. **Admin auth = one passcode** (`ADMIN_PASSCODE` env), cookie session, middleware guarding `/admin/*`. Deliberate simplification — say so in a code comment.
6. **Raising capacity promotes the waitlist.** When admin increases capacity, promote the earliest `waitlisted` registrations to `confirmed` (oldest first) and write an outbox row for each ("A spot opened up — you're confirmed"). Fill-ups aren't a one-way door.
7. **Server-side validation on every mutation** (zod). Never trust client input; return plain-language errors.

## Pages

Public:
- `/` — full-year 2026 view: events grouped by month, compact cards (date, title, city, status chip: Open / Full / Cancelled / Past). Optional city filter if time allows.
- `/events/[slug]` — details, capacity bar ("87 of 120 registered"), registration form (name, email, candidate/employer), correct state for full / cancelled / past. Include an "Add to Google Calendar" link built from the URL template (no library). People plan their week around this — let them put it *in* their week.

Admin (passcode-gated):
- `/admin` — login
- `/admin/events` — table: title, dates, city, capacity usage, status chips, clash chip. Row actions: edit, cancel.
- `/admin/events/new` and `/admin/events/[id]/edit` — one clean form, native date inputs, clash warning banner appears on conflict, danger zone for cancel (requires a reason).
- `/admin/events/[id]/registrants` — confirmed + waitlisted lists with counts, and a "Download CSV" button (the events team lives in spreadsheets).
- `/admin/outbox` — table of notification rows, newest first. One line at top: "In production these would be emails."

## Design direction

- Audience: Malaysian students/grads + HR people. The admin is for a **non-technical events team member** — labels in plain language ("Move this event", "Cancel event", "Who's registered"), zero jargon, active-voice buttons that say what they do.
- Clean corporate-recruiting look: white background, one red accent picked from Talentbank's own branding, strong readable type hierarchy, generous whitespace. Status chips carry meaning (Open = green, Full = amber, Cancelled = red/struck, Past = grey).
- Do NOT use these AI-default looks: cream background + serif + terracotta; near-black + acid green; fake-newspaper hairline columns. No gradient hero, no emoji in UI, no decorative animation.
- Errors and empty states give direction, not mood: "No events in June yet — Add event", "You're already registered for this event with this email."
- Quality floor: responsive down to mobile, visible keyboard focus states.

## Seed data

`scripts/seed.ts` — 15–20 REAL Talentbank 2026 career fairs taken from talentbank.io/career-fairs (titles, dates, cities). Then shape it so demo states are visible immediately:
- a few past events
- one cancelled event (with reason + outbox rows)
- one event at ~95% capacity and one full (with waitlisted registrations)
- two events deliberately clashing (same city, overlapping dates)
- fake registrant names/emails only (e.g. `aina@example.com`) — no real personal data

## Non-goals (do NOT build)

Real auth/user accounts, real email sending, payments, drag-and-drop calendar grid, recurring events, multi-timezone support, i18n, image uploads, attendee self-service cancellation, rate limiting (name these in the reflection instead). If tempted, add a code comment `// out of scope: <thing>` instead.

## Tests (small, deliberate)

Unit tests for `detectClashes` and the capacity/waitlist decision only. A handful of cases each (overlap edges, same-day, different city, exactly-at-capacity). Nothing else.

## README must include

Setup steps, env vars, seed command, a "Key decisions" section (5 bullets max), and the **demo admin passcode for reviewers** — exposing it is fine for a demo. A reviewer who can't open the admin side grades the assignment as missing.

## Milestones — do ONE per session, in order

1. **M1 — Skeleton:** scaffold, Tailwind, Drizzle schema + migrations, seed script with real events, deploy empty-but-running app to Vercel.
2. **M2 — Public:** year view + event detail with all states rendering from seed data.
3. **M3 — Registration:** form, transaction, capacity/waitlist/duplicate handling.
4. **M4 — Admin:** passcode gate, event table, create/edit with clash warning, capacity-raise waitlist promotion, cancel flow with reason, registrants view + CSV, outbox page.
5. **M5 — Polish:** empty states, mobile pass, README, final seed tidy-up.

After each milestone: run the app, list what was verified working, and stop for review.
