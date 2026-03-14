"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(99,102,241,0.12)] bg-[rgba(10,15,30,0.85)] backdrop-blur-xl">
      <div className="page-wrap flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="L2-MEV Shield home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
            L2
          </span>
          <span className="text-sm font-semibold text-slate-200 transition-colors group-hover:text-white">
            MEV Shield
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-indigo-500/10 text-slate-100 nav-link-active"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/mesayanroy/L2-MEV"
            target="_blank"
            rel="noreferrer"
            className="nav-link rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
          >
            GitHub ↗
          </a>
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/dashboard" className="btn-primary text-sm">
            Dashboard
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(99,102,241,0.2)] text-slate-400 transition-colors hover:bg-white/5 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <title>Close menu</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <title>Open menu</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[rgba(99,102,241,0.12)] bg-[rgba(10,15,30,0.95)] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "bg-indigo-500/10 text-slate-100"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://github.com/mesayanroy/L2-MEV"
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
            >
              GitHub ↗
            </a>
            <div className="mt-2 border-t border-[rgba(99,102,241,0.12)] pt-3">
              <Link
                href="/dashboard"
                className="btn-primary w-full text-center text-sm"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
