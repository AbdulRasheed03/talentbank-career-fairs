"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/lib/auth-actions";
import type { AuthState } from "@/lib/auth";

const INITIAL: AuthState = {};

const inputClass =
  "mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm " +
  "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, INITIAL);
  const fe = state.fieldErrors;

  return (
    <form action={action} className="space-y-4" noValidate>
      <Field label="Full name" error={fe?.name}>
        <input name="name" type="text" autoComplete="name" className={inputClass} />
      </Field>

      <Field label="Username" error={fe?.username} hint="lowercase, 3–20 chars">
        <input name="username" type="text" autoComplete="username" className={inputClass} />
      </Field>

      <Field label="Email" error={fe?.email}>
        <input name="email" type="email" autoComplete="email" className={inputClass} />
      </Field>

      <Field label="Password" error={fe?.password} hint="at least 8 characters">
        <input name="password" type="password" autoComplete="new-password" className={inputClass} />
      </Field>

      <Field label="I'm registering as" error={fe?.attendeeType}>
        <select name="attendeeType" defaultValue="candidate" className={inputClass}>
          <option value="candidate">A candidate (job seeker)</option>
          <option value="employer">An employer</option>
        </select>
      </Field>

      {state.error && <p className="text-sm font-medium text-brand">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      {hint && <span className="ml-2 text-xs text-neutral-400">{hint}</span>}
      {children}
      {error && <p className="mt-1 text-xs font-medium text-brand">{error}</p>}
    </label>
  );
}
