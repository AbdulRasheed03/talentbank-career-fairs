"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/lib/auth-actions";
import type { AuthState } from "@/lib/auth";

const INITIAL: AuthState = {};

const inputClass =
  "mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm " +
  "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, INITIAL);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-neutral-800">Username</span>
        <input name="username" type="text" autoComplete="username" className={inputClass} />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-neutral-800">Password</span>
        <input name="password" type="password" autoComplete="current-password" className={inputClass} />
      </label>

      {state.error && <p className="text-sm font-medium text-brand">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-neutral-600">
        No account?{" "}
        <Link href="/register" className="font-medium text-brand hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
