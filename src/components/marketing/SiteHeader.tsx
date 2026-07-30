"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { contact, megaMenu, navTabs, wordmark } from "@/content/site";

const EASE_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

export function SiteHeader({ user }: { user: { name: string } | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mega-menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const onDark = !scrolled; // transparent over the navy hero
  const textColor = onDark ? "text-paper" : "text-navy-900";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-[400ms] ${
        onDark
          ? "bg-transparent"
          : "border-b border-gold/60 bg-paper"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.25,1,0.5,1)" }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-16">
        {/* Wordmark */}
        <Link
          href="/"
          className={`text-lg font-extrabold italic tracking-tight transition-colors ${
            onDark ? "text-paper" : "text-redx"
          }`}
        >
          {wordmark}
        </Link>

        {/* Desktop nav tab strip */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`group inline-flex items-center gap-2 text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors hover:text-champagne ${textColor}`}
            >
              {tab.label}
              {tab.badge && (
                <span className="rounded-full border border-gold px-1.5 py-0.5 text-[0.625rem] tracking-[0.1em] text-champagne">
                  {tab.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right: auth (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <Link
                href="/events"
                className={`text-[0.8125rem] font-medium uppercase tracking-[0.12em] ${textColor} hover:text-champagne`}
              >
                Hi, {user.name.split(" ")[0]}
              </Link>
            ) : (
              <Link
                href="/login"
                className={`text-[0.8125rem] font-medium uppercase tracking-[0.12em] ${textColor} hover:text-champagne`}
              >
                Sign in
              </Link>
            )}
            <Link
              href="/register"
              className="rounded-md bg-redx px-4 py-2 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-redx-deep"
            >
              {user ? "My account" : "Sign up"} <span aria-hidden>→</span>
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className={`flex h-10 w-10 items-center justify-center border lg:hidden ${
              onDark ? "border-paper text-paper" : "border-navy-900 text-navy-900"
            }`}
          >
            <span aria-hidden className="text-lg leading-none">≡</span>
          </button>
        </div>
      </div>

      {/* Full-screen mega-menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE_QUART }}
            className="fixed inset-0 z-50 overflow-y-auto bg-paper"
          >
            <div className="mx-auto max-w-[1280px] px-6 py-6 lg:px-16">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold italic tracking-tight text-redx">
                  {wordmark}
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center border border-navy-900 text-navy-900"
                >
                  <span aria-hidden className="text-lg leading-none">✕</span>
                </button>
              </div>

              <div className="mt-12 grid gap-10 sm:grid-cols-3">
                {megaMenu.map((col, ci) => (
                  <div key={col.group}>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-champagne-deep">
                      {col.group}
                    </p>
                    <ul className="mt-4 space-y-5">
                      {col.links.map((link, li) => (
                        <motion.li
                          key={link.title}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + (ci * col.links.length + li) * 0.04, ease: EASE_QUART }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="group block"
                          >
                            <span className="font-serif text-xl text-navy-900 group-hover:text-champagne-deep">
                              {link.title}
                            </span>
                            <span className="mt-0.5 block text-sm text-warm-grey">
                              {link.desc}
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-12 border-t border-paper-deep pt-6 text-sm text-warm-grey">
                <p>WhatsApp {contact.whatsapp}</p>
                <p>{contact.email}</p>
                <p>{contact.address}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
