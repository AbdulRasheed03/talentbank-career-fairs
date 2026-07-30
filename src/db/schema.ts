import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// events
// ---------------------------------------------------------------------------
// Dates are PLAIN "YYYY-MM-DD" text, Malaysia time implicit. We never parse them
// with new Date("YYYY-MM-DD") (that shifts to UTC and can move the day). They are
// compared/sorted as strings and formatted for display by hand. See SPEC.
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  startDate: text("start_date").notNull(), // "YYYY-MM-DD"
  endDate: text("end_date").notNull(), // "YYYY-MM-DD"
  timeLabel: text("time_label").notNull(), // display-only, e.g. "10:00 AM – 6:00 PM"
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  description: text("description").notNull(),
  capacity: integer("capacity").notNull(),
  status: text("status", { enum: ["scheduled", "cancelled"] })
    .notNull()
    .default("scheduled"),
  cancellationReason: text("cancellation_reason"), // nullable; set when cancelled
  // Audit timestamps only. NOT domain dates — safe to store as ISO text.
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ---------------------------------------------------------------------------
// registrations
// ---------------------------------------------------------------------------
export const registrations = sqliteTable(
  "registrations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    attendeeType: text("attendee_type", {
      enum: ["candidate", "employer"],
    }).notNull(),
    status: text("status", { enum: ["confirmed", "waitlisted"] })
      .notNull()
      .default("confirmed"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    // One signup per email per event. Duplicate signups get a friendly error,
    // not a database crash (see SPEC).
    unique("registrations_event_email_unique").on(table.eventId, table.email),
  ],
);

// ---------------------------------------------------------------------------
// notifications — the "outbox"
// ---------------------------------------------------------------------------
// Rows are written but never sent. Deliberate stub for email.
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  recipientEmail: text("recipient_email").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ---------------------------------------------------------------------------
// users — real accounts (login + register)
// ---------------------------------------------------------------------------
// Public visitors self-register as role 'user'. The single 'admin' account is
// seeded directly (scripts/seed.ts) and can never be created through the public
// register form. Passwords are stored hashed (see src/lib/passwords.ts).
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["user", "admin"] })
    .notNull()
    .default("user"),
  attendeeType: text("attendee_type", { enum: ["candidate", "employer"] })
    .notNull()
    .default("candidate"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// Inferred row types for use across the app.
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
