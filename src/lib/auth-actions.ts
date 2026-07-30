"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { loginSchema, registerSchema, type AuthState } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { isUniqueViolation } from "@/lib/registration";
import { createSession, destroySession } from "@/lib/session-server";

// Log in with username + password. Same form for everyone; the seeded admin
// account simply has role "admin". A failure is deliberately vague (doesn't say
// whether it was the username or the password).
export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Please enter your username and password." };
  }

  const username = parsed.data.username.toLowerCase();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return { error: "Incorrect username or password." };
  }

  await createSession({ uid: user.id, role: user.role });
  redirect(user.role === "admin" ? "/admin/events" : "/");
}

// Public self-registration. Always creates a role "user" account — the admin
// account can never be made here (SPEC-style deliberate design: it's seeded).
export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    attendeeType: formData.get("attendeeType"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  let created: { id: number; role: "user" | "admin" };
  try {
    const [row] = await db
      .insert(users)
      .values({
        name: data.name,
        username: data.username,
        email: data.email,
        passwordHash: hashPassword(data.password),
        role: "user",
        attendeeType: data.attendeeType,
      })
      .returning({ id: users.id, role: users.role });
    created = row;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { error: "That username or email is already registered." };
    }
    throw err;
  }

  await createSession({ uid: created.id, role: created.role });
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
