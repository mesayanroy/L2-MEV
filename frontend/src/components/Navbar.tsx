"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/docs",       label: "Docs" },
  { href: "/docs/cli",   label: "CLI Reference" },
  { href: "/docs/api",   label: "API Reference" },
  { href: "/dashboard",  label: "Dashboard" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-500">
          <span className="text-2xl">🛡️</span>
          <span>L2-MEV Shield</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/mesayanroy/L2-MEV"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            GitHub ↗
          </a>
          <Link
            href="/docs"
            className="rounded-md bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-400"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-dark-border bg-dark-card md:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-4 py-3 text-sm text-slate-300 hover:bg-dark-border"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
