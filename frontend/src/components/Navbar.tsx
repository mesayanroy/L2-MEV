"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "About" },
  { href: "/docs", label: "Docs" },
  { href: "/docs/api", label: "Security" },
  { href: "https://github.com/mesayanroy/L2-MEV", label: "Github" },
  { href: "/docs/cli", label: "Discord" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="px-3 py-4 sm:px-6">
      <div className="page-wrap flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-blue-600">
          <span className="text-3xl leading-none">∟</span>
          <span className="sr-only">L2-MEV Shield</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => {
            const isExternal = l.href.startsWith("http");
            if (isExternal) {
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="classic-link"
                >
                  {l.label}
                </a>
              );
            }

            return (
              <Link key={l.label} href={l.href} className="classic-link">
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/dashboard" className="classic-button">
            Dashboard
          </Link>
        </div>

        <button
          className="rounded border border-gray-400 px-3 py-2 text-gray-700 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="page-wrap mt-3 rounded border border-gray-300 bg-gray-100 p-3 lg:hidden">
          <div className="grid gap-2">
            {NAV_LINKS.map((l) => {
              const isExternal = l.href.startsWith("http");
              if (isExternal) {
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="classic-link rounded px-2 py-2"
                  >
                    {l.label}
                  </a>
                );
              }

              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className="classic-link rounded px-2 py-2"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
