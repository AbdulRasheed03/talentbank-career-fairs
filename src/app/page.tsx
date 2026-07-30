import { BackToTop } from "@/components/marketing/BackToTop";
import { Hero } from "@/components/marketing/Hero";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SmoothScroll } from "@/components/marketing/SmoothScroll";
import { getCurrentUser } from "@/lib/session-server";

// Marketing landing (talentbank.io "Institutional Authority" look). Admins are
// bounced to /admin by the middleware, so this is only ever seen by visitors
// and logged-in users. Only the header + hero are built so far.
export const dynamic = "force-dynamic";

export default async function MarketingHome() {
  const user = await getCurrentUser();

  return (
    <>
      <SmoothScroll />
      <SiteHeader user={user ? { name: user.name } : null} />
      <main>
        <Hero />
      </main>
      <BackToTop />
    </>
  );
}
