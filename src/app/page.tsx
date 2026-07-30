import { AssessmentTeaser } from "@/components/marketing/AssessmentTeaser";
import { Awards } from "@/components/marketing/Awards";
import { BackToTop } from "@/components/marketing/BackToTop";
import { ClientWall } from "@/components/marketing/ClientWall";
import { ClosingCTA } from "@/components/marketing/ClosingCTA";
import { Hero } from "@/components/marketing/Hero";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { Publication } from "@/components/marketing/Publication";
import { MotionProvider } from "@/components/marketing/Reveal";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SmoothScroll } from "@/components/marketing/SmoothScroll";
import { StatsBand } from "@/components/marketing/StatsBand";
import { ThreeAudiences } from "@/components/marketing/ThreeAudiences";
import { getCurrentUser } from "@/lib/session-server";

// Marketing landing (talentbank.io "Institutional Authority" look). Admins are
// bounced to /admin by the middleware, so this is only seen by visitors + users.
export const dynamic = "force-dynamic";

export default async function MarketingHome() {
  const user = await getCurrentUser();

  return (
    <>
      <SmoothScroll />
      <SiteHeader user={user ? { name: user.name } : null} />
      <MotionProvider>
        <main>
          <Hero />
          <StatsBand />
          <ClientWall />
          <ThreeAudiences />
          <ProductShowcase />
          <AssessmentTeaser />
          <Publication />
          <Awards />
          <ClosingCTA />
        </main>
        <SiteFooter />
      </MotionProvider>
      <BackToTop />
    </>
  );
}
