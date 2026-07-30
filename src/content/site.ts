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

// §2 Stats band (numbers count up on enter-view).
export const statsBand: { value: number; suffix: string; label: string }[] = [
  { value: 50, suffix: "+", label: "Fairs a year" },
  { value: 120, suffix: "K", label: "Attendees reached" },
  { value: 800, suffix: "+", label: "Hiring partners" },
  { value: 12, suffix: "", label: "Cities" },
];

// §3 Client wall (auto-scrolling marquee of partner names — placeholders).
export const clientWall = {
  eyebrow: "TRUSTED BY",
  headlinePrefix: "The employers who",
  headlineItalic: "show up",
  lede: "From national banks to fast-growing startups, hundreds of companies meet their next hires at our fairs.",
  names: [
    "Maybank", "Petronas", "Grab", "Intel", "AirAsia", "Nestlé",
    "CIMB", "Shopee", "Sunway", "Top Glove", "AmBank", "Axiata",
    "Sime Darby", "Hong Leong", "Digi", "Astro", "Gamuda", "IHH Health",
  ],
};

// §4 Three audiences.
export const audiences: { no: string; title: string; body: string; href: string }[] = [
  { no: "01", title: "Employers", body: "Meet thousands of screened graduates in a single day, in the cities you hire in.", href: "/coming-soon/?from=for-employers" },
  { no: "02", title: "Universities", body: "Bring the job market to your students and track where they land.", href: "/coming-soon/?from=for-universities" },
  { no: "03", title: "Talent", body: "Find the companies hiring now — and walk in ready with a plan.", href: "/coming-soon/?from=for-talent" },
];

// §5 Product showcase (the faux app window UI is built in the component).
export const showcase = {
  eyebrow: "◆ THE TALENT PLATFORM",
  headlinePrefix: "Everything a graduate needs,",
  headlineItalic: "in one place",
  body: "Readiness scoring, employer matches, event reminders and application tracking — so students arrive at a fair knowing exactly who to meet.",
  pill: "EARLY PRIVATE ACCESS",
};

// §6 Assessment / quiz teaser.
export const assessment = {
  eyebrow: "CAREER READINESS",
  question: "How ready are you for the fair?",
  explainer: "A short assessment maps your strengths to the employers who'll be in the room — so you spend the day on the right conversations.",
  discover: [
    "Which industries fit your strengths",
    "The roles you're most competitive for",
    "What to prepare before you walk in",
  ],
  stats: [
    { value: "12", label: "Questions" },
    { value: "4", label: "Minutes" },
    { value: "10", label: "Matches" },
  ],
  cta: { label: "Start the assessment", href: "/coming-soon/?from=assessment" },
};

// §7 Publication (CSS book cover).
export const publication = {
  eyebrow: "THE GRADUATE REPORT",
  headlinePrefix: "What Malaysia's employers",
  headlineItalic: "actually want",
  body: "Our annual report on hiring intent, in-demand skills and starting salaries — drawn from the employers at our fairs.",
  book: { title: "The Graduate", italicWord: "Report", subtitle: "MALAYSIA · 2026 EDITION" },
  stats: [
    { value: "800", plus: true, label: "Employers surveyed" },
    { value: "50", plus: true, label: "Data points" },
  ],
};

// §8 Awards / hall of fame.
export const awards = {
  eyebrow: "HALL OF FAME",
  headlinePrefix: "Journeys that",
  headlineItalic: "started at a fair",
  entries: [
    { no: "01", relation: "CAMPUS → MNC", title: "From booth to boardroom", desc: "A fresh grad who joined a hiring partner as a management trainee.", stat: "3-year climb", badge: null as string | null },
    { no: "02", relation: "STARTUP → SCALE-UP", title: "First ten hires", desc: "A startup that built its founding team across two fairs.", stat: "10 hires", badge: null },
    { no: "03", relation: "REGIONAL → NATIONAL", title: "Talent, everywhere", desc: "Expanding a graduate pipeline from one city to twelve.", stat: "12 cities", badge: "LAUNCHING SOON" },
    { no: "04", relation: "STUDENT → MENTOR", title: "Paying it forward", desc: "Yesterday's attendees mentoring this year's graduates.", stat: "New in 2026", badge: "LAUNCHING SOON" },
  ],
};

// §9 Closing CTA.
export const closing = {
  headlinePrefix: "Your next hire, or your next role,",
  headlineItalic: "is one fair away",
  body: "Browse the 2026 calendar and reserve your spot — it takes about a minute.",
  primary: { label: "Browse the calendar", href: "/events" },
  secondary: { label: "Create a free account", href: "/register" },
  feature: {
    title: "The Talent Platform",
    desc: "Readiness scores, employer matches and application tracking — join the early-access list.",
    href: "/coming-soon/?from=platform",
  },
};

// §10 Footer.
export const footer = {
  positioning: "Malaysia's career-fair network — connecting graduates and employers since day one.",
  columns: [
    { heading: "WHO WE SERVE", links: [
      { label: "For employers", href: "/coming-soon/?from=for-employers" },
      { label: "For universities", href: "/coming-soon/?from=for-universities" },
      { label: "For talent", href: "/coming-soon/?from=for-talent" },
    ] },
    { heading: "CAREER FAIRS", links: [
      { label: "2026 calendar", href: "/events" },
      { label: "Register", href: "/register" },
      { label: "Sign in", href: "/login" },
    ] },
    { heading: "PLATFORM", links: [
      { label: "The Talent Platform", href: "/coming-soon/?from=platform" },
      { label: "Career assessment", href: "/coming-soon/?from=assessment" },
      { label: "The Graduate Report", href: "/coming-soon/?from=report" },
    ] },
    { heading: "COMPANY", links: [
      { label: "About", href: "/coming-soon/?from=about" },
      { label: "Contact", href: `mailto:${contact.email}` },
      { label: "Careers", href: "/coming-soon/?from=careers" },
    ] },
    { heading: "LEGAL", links: [
      { label: "Privacy", href: "/coming-soon/?from=privacy" },
      { label: "Terms", href: "/coming-soon/?from=terms" },
    ] },
  ],
  legal: {
    reg: "Talentbank (Demo) · 000000-X",
    links: ["Privacy", "Terms", "Cookies"],
  },
};
