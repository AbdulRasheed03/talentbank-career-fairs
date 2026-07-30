import { PageBand } from "@/components/marketing/PageBand";
import { RegisterForm } from "@/components/RegisterForm";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { getCurrentUser } from "@/lib/session-server";

export const dynamic = "force-dynamic";

// Public sign-up. Only ever creates a role "user" account — the admin account
// is seeded and can't be made here.
export default async function RegisterPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-paper text-navy-900">
      <SiteHeader user={user ? { name: user.name } : null} />

      <PageBand>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne">
          Join Talentbank
        </p>
        <h1
          className="mt-4 font-serif font-light tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.3rem)" }}
        >
          Create your <em className="headline-italic">account</em>.
        </h1>
        <p className="mt-4 max-w-md text-lg text-paper/80">
          Sign up to register for Talentbank career fairs across Malaysia.
        </p>
      </PageBand>

      <main className="mx-auto max-w-sm px-6 py-14">
        <div className="rounded-lg border border-paper-deep bg-cream p-6">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
