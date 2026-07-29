import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// One database client for the whole app.
// - Local dev: TURSO_DATABASE_URL = "file:local.db" (a SQLite file, no token).
// - Production: TURSO_DATABASE_URL + TURSO_AUTH_TOKEN point at Turso (libSQL).
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
