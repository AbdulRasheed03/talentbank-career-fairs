"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/auth-actions";

const INITIAL: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, INITIAL);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-neutral-800">Passcode</span>
        <input
          name="passcode"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </label>

      {state.error && (
        <p className="text-sm font-medium text-brand">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Checking…" : "Enter admin"}
      </button>
    </form>
  );
}
