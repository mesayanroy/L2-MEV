import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "CLI Reference", href: "/docs/cli" },
      { label: "API Reference", href: "/docs/api" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/mesayanroy/L2-MEV", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[rgba(99,102,241,0.12)] bg-[rgba(10,15,30,0.8)] pb-10 pt-16">
      <div className="page-wrap">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                L2
              </span>
              <span className="text-sm font-semibold text-slate-200">MEV Shield</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Open infrastructure for safer Solana execution. Detect threats, route privately,
              and protect every swap.
            </p>
          </div>

          {/* Link groups */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.heading}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-slate-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(99,102,241,0.1)] pt-8 sm:flex-row">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} L2-MEV Shield. All rights reserved.
          </p>
          <p className="text-sm text-slate-600">
            Built on Solana · Powered by Jito
          </p>
        </div>
      </div>
    </footer>
  );
}
