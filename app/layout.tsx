import type { Metadata } from "next";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launch Distribution Graph",
  description: "How Social Capital Inc.'s claimed launches propagate on X and LinkedIn, reconstructed from public data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen antialiased overflow-x-hidden">
        <header className="border-b" style={{ borderColor: "var(--line)" }}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
            <Link href="/" className="text-sm font-medium no-underline whitespace-nowrap">▲ Launch Distribution Graph</Link>
            <nav className="text-sm muted flex gap-4 sm:gap-5 whitespace-nowrap">
              <Link href="/#ask" className="no-underline">Ask</Link>
              <Link href="/#details" className="no-underline">Data</Link>
              <a href="https://www.sociallcapital.com/work" target="_blank" rel="noreferrer" className="no-underline hidden sm:inline">sociallcapital.com/work ↗</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 sm:px-6 py-10 text-xs muted border-t" style={{ borderColor: "var(--line)" }}>Public data only. Timing shows sequence, never cause. No claim is made that any account was paid.</footer>
      </body>
    </html>
  );
}
