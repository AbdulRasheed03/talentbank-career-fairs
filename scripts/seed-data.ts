// ---------------------------------------------------------------------------
// Seed data — real Talentbank 2026 career fairs, shaped for a live demo.
//
// Kept in its own module (no database imports) so it can be unit tested as
// plain data: tests/seed-data.test.ts asserts that every required demo state
// is present (a cancelled event, a full event with a waitlist, a ~95% event,
// past + upcoming events, and a deliberate clash pair). scripts/seed.ts turns
// this data into database rows.
//
// Most events below are real Talentbank 2026 fairs (Sunway Pyramid, Penang
// Tech/Eng/Semicon, National @ MITEC, Penang, Engineering, BAFI, Tech, Johor)
// plus GRADUAN Aspire. A few regional stops (Ipoh, Kuching, Kota Kinabalu,
// Melaka, Shah Alam, and the two demo KL fairs) are representative placeholders
// so every demo state is visible; verify exact dates against the live calendar
// (talentbank.io/career-fairs) before the real demo.
//
// Dates are plain "YYYY-MM-DD" strings — never new Date("YYYY-MM-DD").
// ---------------------------------------------------------------------------

// The reference "today" the seed is shaped around: anything ending before this
// shows as Past. The tests use the same value so past/upcoming assertions match
// what a reviewer sees right after seeding.
export const SEED_TODAY = "2026-07-28";

export type SeedEvent = {
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
  timeLabel: string;
  venue: string;
  city: string;
  description: string;
  capacity: number;
  status?: "scheduled" | "cancelled";
  cancellationReason?: string;
  // Demo shaping: how many confirmed / waitlisted registrants to generate.
  // Counts are NOT stored on the event — they exist because we insert this
  // many real registration rows (confirmed count is always derived).
  confirmed: number;
  waitlisted: number;
};

export const SEED_EVENTS: SeedEvent[] = [
  // ----- Past events (ended before 2026-07-28) -----
  {
    slug: "talentbank-sunway-pyramid-feb-2026",
    title: "Talentbank Career Fair @ Sunway Pyramid",
    startDate: "2026-02-07",
    endDate: "2026-02-08",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "Sunway Pyramid Convention Centre (CP3)",
    city: "Subang Jaya",
    description:
      "Talentbank's flagship weekend fair with employers across every industry, Career Talks and on-the-spot interviews.",
    capacity: 250,
    confirmed: 60,
    waitlisted: 0,
  },
  {
    slug: "penang-tech-engineering-semicon-2026",
    title: "Penang Tech, Engineering & Semicon Career Fair",
    startDate: "2026-04-25",
    endDate: "2026-04-25",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "JEN Penang Georgetown by Shangri-La",
    city: "George Town",
    description:
      "Focused hiring day for engineering, semiconductor and technology talent, run with InvestPenang.",
    capacity: 150,
    confirmed: 40,
    waitlisted: 0,
  },
  {
    slug: "graduan-aspire-career-fair-2026",
    title: "GRADUAN Aspire Career Fair",
    startDate: "2026-06-06",
    endDate: "2026-06-07",
    timeLabel: "11:00 AM – 6:00 PM",
    venue: "Kuala Lumpur Convention Centre (KLCC)",
    city: "Kuala Lumpur",
    description:
      "Graduate-focused fair bringing together top Malaysian employers, professionals and fresh graduates.",
    capacity: 300,
    confirmed: 80,
    waitlisted: 0,
  },
  {
    slug: "talentbank-national-career-fair-jun-2026",
    title: "Talentbank National Career Fair",
    startDate: "2026-06-27",
    endDate: "2026-06-28",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "MITEC — Malaysia International Trade & Exhibition Centre",
    city: "Kuala Lumpur",
    description:
      "The national-scale edition: hundreds of roles from Malaysia's largest employers under one roof.",
    capacity: 300,
    confirmed: 90,
    waitlisted: 0,
  },

  // ----- Upcoming events -----
  {
    slug: "talentbank-penang-career-fair-aug-2026",
    title: "Talentbank Penang Career Fair",
    startDate: "2026-08-01",
    endDate: "2026-08-01",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "Setia SPICE Convention Centre",
    city: "George Town",
    description:
      "Northern-region hiring day connecting Penang employers with local and returning talent.",
    capacity: 150,
    confirmed: 45,
    waitlisted: 0,
  },
  {
    slug: "talentbank-ipoh-career-fair-aug-2026",
    title: "Talentbank Ipoh Career Fair",
    startDate: "2026-08-15",
    endDate: "2026-08-15",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "Ipoh Convention Centre",
    city: "Ipoh",
    // Demo: this one is CANCELLED (with a reason + outbox rows below).
    status: "cancelled",
    cancellationReason:
      "Venue double-booked by the operator. We're rebooking Ipoh for Q1 2027 and will notify everyone registered.",
    description:
      "Perak-region fair for fresh graduates and experienced hires across manufacturing, services and tech.",
    capacity: 120,
    confirmed: 12, // kept on a cancelled event; each gets an outbox notice
    waitlisted: 0,
  },
  {
    slug: "talentbank-engineering-career-fair-aug-2026",
    title: "Talentbank Engineering Career Fair",
    startDate: "2026-08-22",
    endDate: "2026-08-22",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "MITEC — Hall 5",
    city: "Kuala Lumpur",
    description:
      "Specialist fair for mechanical, electrical, civil and chemical engineering roles.",
    // Demo: FULL event with a waitlist (capacity exactly filled).
    capacity: 100,
    confirmed: 100,
    waitlisted: 4,
  },
  {
    slug: "talentbank-kuching-career-fair-sep-2026",
    title: "Talentbank Kuching Career Fair",
    startDate: "2026-09-05",
    endDate: "2026-09-06",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "Borneo Convention Centre Kuching",
    city: "Kuching",
    description:
      "Sarawak-region fair connecting East Malaysian talent with employers hiring locally and in the Peninsula.",
    capacity: 150,
    confirmed: 20,
    waitlisted: 0,
  },
  // ----- Deliberate clash pair: same city (Kuala Lumpur), overlapping dates -----
  {
    slug: "talentbank-bafi-career-fair-sep-2026",
    title: "Talentbank BAFI Career Fair",
    startDate: "2026-09-12",
    endDate: "2026-09-12",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "Sunway Putra Hotel, Kuala Lumpur",
    city: "Kuala Lumpur",
    description:
      "Banking, Accounting, Finance & Insurance hiring day for finance-track graduates and professionals.",
    capacity: 180,
    confirmed: 30,
    waitlisted: 0,
  },
  {
    slug: "talentbank-kl-graduate-mega-fair-sep-2026",
    title: "Talentbank KL Graduate Mega Fair",
    startDate: "2026-09-12",
    endDate: "2026-09-13",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "World Trade Centre Kuala Lumpur",
    city: "Kuala Lumpur",
    description:
      "Large cross-industry graduate fair. NOTE: overlaps the BAFI fair on 12 Sep in KL — a deliberate clash for the demo.",
    capacity: 250,
    confirmed: 90,
    waitlisted: 0,
  },
  {
    slug: "talentbank-kota-kinabalu-career-fair-sep-2026",
    title: "Talentbank Kota Kinabalu Career Fair",
    startDate: "2026-09-19",
    endDate: "2026-09-20",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "Sabah International Convention Centre",
    city: "Kota Kinabalu",
    description:
      "Sabah-region fair for graduates and experienced hires across tourism, services and technology.",
    capacity: 150,
    confirmed: 18,
    waitlisted: 0,
  },
  {
    slug: "talentbank-tech-career-fair-oct-2026",
    title: "Talentbank Tech Career Fair",
    startDate: "2026-10-03",
    endDate: "2026-10-03",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "KL Gateway Mall Convention Space",
    city: "Kuala Lumpur",
    description:
      "Software, data, cybersecurity and product roles from Malaysia's fastest-growing tech employers.",
    // Demo: ~95% full (114 of 120) — capacity bar in the amber zone.
    capacity: 120,
    confirmed: 114,
    waitlisted: 0,
  },
  {
    slug: "talentbank-johor-career-fair-oct-2026",
    title: "Talentbank Johor Career Fair",
    startDate: "2026-10-03",
    endDate: "2026-10-04",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "Persada Johor International Convention Centre",
    city: "Johor Bahru",
    description:
      "Southern-region fair serving Johor and the JS-SEZ growth corridor across manufacturing, logistics and services.",
    capacity: 200,
    confirmed: 55,
    waitlisted: 0,
  },
  {
    slug: "talentbank-healthcare-pharma-fair-oct-2026",
    title: "Talentbank Healthcare & Pharma Career Fair",
    startDate: "2026-10-24",
    endDate: "2026-10-24",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "SACC — Shah Alam Convention Centre",
    city: "Shah Alam",
    description:
      "Hiring day for nursing, allied health, pharmaceutical and medical-device roles.",
    capacity: 140,
    confirmed: 8,
    waitlisted: 0,
  },
  {
    slug: "talentbank-melaka-career-fair-nov-2026",
    title: "Talentbank Melaka Career Fair",
    startDate: "2026-11-07",
    endDate: "2026-11-08",
    timeLabel: "10:00 AM – 5:00 PM",
    venue: "Melaka International Trade Centre (MITC)",
    city: "Melaka",
    description:
      "Historic-city fair connecting central-region graduates with employers across tourism, services and industry.",
    capacity: 150,
    confirmed: 10,
    waitlisted: 0,
  },
  {
    slug: "talentbank-digital-creative-fair-nov-2026",
    title: "Talentbank Digital & Creative Career Fair",
    startDate: "2026-11-21",
    endDate: "2026-11-22",
    timeLabel: "10:00 AM – 6:00 PM",
    venue: "REXKL",
    city: "Kuala Lumpur",
    description:
      "Design, content, marketing and digital-media roles for creative talent. (KL, but different dates — no clash.)",
    capacity: 160,
    confirmed: 25,
    waitlisted: 0,
  },
];
