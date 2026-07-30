import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

// Admin login. The middleware bounces logged-in visitors straight to
// /admin/events, so this page only shows when you're signed out.
export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Enter the shared passcode to manage career fairs.
      </p>

      <div className="mt-6 rounded-lg border border-neutral-200 p-6">
        <LoginForm />
      </div>

      {/* Exposed on purpose so reviewers can get in (see README / SPEC). */}
      <p className="mt-4 text-center text-xs text-neutral-400">
        Demo passcode: <code className="text-neutral-500">talentbank2026</code>
      </p>
    </main>
  );
}
