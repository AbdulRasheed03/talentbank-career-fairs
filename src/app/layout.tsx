import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talentbank Career Fairs",
  description: "Career fair calendar for Talentbank — Malaysia, 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <header className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-brand">
                Talentbank
              </span>
              <span className="text-sm text-neutral-500">Career Fairs 2026</span>
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
