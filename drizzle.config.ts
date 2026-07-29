import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Drizzle Kit config drives `db:generate` (SQL migrations) and `db:migrate`.
// Locally this points at file:local.db; in production it uses the Turso env vars.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
