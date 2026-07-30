import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

// Public sign-up. Only ever creates a role "user" account — the admin account
// is seeded and can't be made here.
export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Sign up to register for Talentbank career fairs across Malaysia.
      </p>

      <div className="mt-6 rounded-lg border border-neutral-200 p-6">
        <RegisterForm />
      </div>
    </main>
  );
}
