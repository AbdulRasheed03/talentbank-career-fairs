import { LoginForm } from "@/components/LoginForm";
import { PageBand } from "@/components/marketing/PageBand";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { getCurrentUser } from "@/lib/session-server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-paper text-navy-900">
      <SiteHeader user={user ? { name: user.name } : null} />

      <PageBand>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne">
          Welcome back
        </p>
        <h1
          className="mt-4 font-serif font-light tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.3rem)" }}
        >
          Sign in
        </h1>
        <p className="mt-4 max-w-md text-lg text-paper/80">
          Log in to register for career fairs — or to manage them as an admin.
        </p>
      </PageBand>

      <main className="mx-auto max-w-sm px-6 py-14">
        <div className="rounded-lg border border-paper-deep bg-cream p-6">
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
