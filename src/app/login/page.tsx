import { LoginForm } from "@/components/LoginForm";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { getCurrentUser } from "@/lib/session-server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-paper text-navy-900">
      <SiteHeader user={user ? { name: user.name } : null} solid />

      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-sm flex-col justify-center px-6 pb-10 pt-24">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
          Welcome back
        </p>
        <h1
          className="mt-2 font-serif font-light tracking-[-0.02em]"
          style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
        >
          Sign in
        </h1>
        <p className="mt-2 text-sm text-warm-grey">
          Log in to register for career fairs — or to manage them as an admin.
        </p>

        <div className="mt-6 rounded-lg border border-paper-deep bg-cream p-6">
          <LoginForm />
        </div>

        {/* Exposed on purpose so reviewers can reach the admin side. */}
        <p className="mt-4 text-center text-xs text-warm-grey-light">
          Admin demo — username <code className="text-warm-grey">admin</code>, password{" "}
          <code className="text-warm-grey">talentbank2026</code>
        </p>
      </main>
    </div>
  );
}
