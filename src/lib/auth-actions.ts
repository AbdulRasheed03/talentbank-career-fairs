"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE } from "@/lib/admin-cookie";

export type LoginState = { error?: string };

// Check the shared passcode and, if it matches, set the session cookie.
// (See middleware.ts for why this is a deliberate single-passcode design.)
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const passcode = String(formData.get("passcode") ?? "");

  if (!process.env.ADMIN_PASSCODE || passcode !== process.env.ADMIN_PASSCODE) {
    return { error: "Incorrect passcode. Please try again." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, passcode, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  redirect("/admin/events");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}
