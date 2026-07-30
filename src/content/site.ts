// ---------------------------------------------------------------------------
// Marketing-site content tokens. All copy lives here (no hardcoded strings in
// components) so it's easy to swap for final copy later. PLACEHOLDER values —
// the rotating brand names in particular are illustrative, not endorsements.
// ---------------------------------------------------------------------------

export const wordmark = "TALENTBANK";

export const hero = {
  eyebrow: "MALAYSIA'S CAREER-FAIR NETWORK",
  headlinePrefix: "Employers like",
  // PLACEHOLDER demo names — replace with real partners/logos.
  rotatingBrands: ["Maybank", "Petronas", "Grab", "Intel", "AirAsia"],
  headlineSuffix: "meet the graduates who",
  headlineItalic: "build what's next",
  sub: "Around fifty fairs a year, in cities the length of the country — connecting Malaysia's students and fresh graduates with the companies hiring them.",
  stats: [
    { value: "50+", label: "Fairs a year" },
    { value: "12", label: "Cities" },
    { value: "100+", label: "Universities" },
    { value: "800+", label: "Employers" },
  ],
  cta: { label: "Browse the 2026 calendar", href: "/events" },
};

// Sticky desktop tab strip (max 5). Real destinations point at live routes;
// unbuilt audience pages point at the /coming-soon stub so no tab is ever dead.
export const navTabs: {
  label: string;
  href: string;
  badge: "NEW" | "SOON" | "LIVE" | null;
}[] = [
  { label: "FOR EMPLOYERS", href: "/coming-soon/?from=for-employers", badge: null },
  { label: "FOR UNIVERSITIES", href: "/coming-soon/?from=for-universities", badge: null },
  { label: "FOR TALENT", href: "/coming-soon/?from=for-talent", badge: null },
  { label: "CAREER FAIRS", href: "/events", badge: "LIVE" },
];

// Full-screen hamburger mega-menu: three columns, each link a title + descriptor.
export const megaMenu: {
  group: string;
  links: { title: string; desc: string; href: string }[];
}[] = [
  {
    group: "WHO WE SERVE",
    links: [
      { title: "For employers", desc: "Hire early-career talent at scale.", href: "/coming-soon/?from=for-employers" },
      { title: "For universities", desc: "Bring the market to your students.", href: "/coming-soon/?from=for-universities" },
      { title: "For talent", desc: "Meet the companies hiring now.", href: "/coming-soon/?from=for-talent" },
    ],
  },
  {
    group: "CAREER FAIRS",
    links: [
      { title: "2026 calendar", desc: "Every fair, grouped by month.", href: "/events" },
      { title: "Register for a fair", desc: "Reserve your spot in a click.", href: "/events" },
    ],
  },
  {
    group: "COMPANY",
    links: [
      { title: "Sign in", desc: "For registered attendees and admins.", href: "/login" },
      { title: "Create an account", desc: "Free for students and graduates.", href: "/register" },
      { title: "About Talentbank", desc: "Our story and mission.", href: "/coming-soon/?from=about" },
    ],
  },
];

export const contact = {
  whatsapp: "+60 12-345 6789",
  email: "hello@talentbank.example",
  address: "Kuala Lumpur, Malaysia",
};
