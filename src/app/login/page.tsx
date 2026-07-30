import { LoginForm } from "@/components/LoginForm";
import { PublicHeader } from "@/components/PublicHeader";

export const dynamic = "force-dynamic";

// Shared sign-in for everyone. Public users land back on the site; the seeded
// admin lands in the admin dashboard (handled by the login action + middleware).
export default function LoginPage() {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Log in to register for career fairs — or to manage them as an admin.
      </p>

      <div className="mt-6 rounded-lg border border-neutral-200 p-6">
        <LoginForm />
      </div>

      {/* Exposed on purpose so reviewers can reach the admin side. */}
      <p className="mt-4 text-center text-xs text-neutral-400">
        Admin demo — username <code className="text-neutral-500">admin</code>, password{" "}
        <code className="text-neutral-500">talentbank2026</code>
      </p>
      </main>
    </>
  );
}
