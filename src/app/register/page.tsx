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
      <SiteHeader user={user ? { name: user.name } : null} solid />

      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-sm flex-col justify-center px-6 pb-10 pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
          Join Talentbank
        </p>
        <h1
          className="mt-2 font-serif font-light tracking-[-0.02em]"
          style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
        >
          Create your account
        </h1>
        <p className="mt-2 text-sm text-warm-grey">
          Sign up to register for Talentbank career fairs across Malaysia.
        </p>

        <div className="mt-6 rounded-lg border border-paper-deep bg-cream p-6">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
