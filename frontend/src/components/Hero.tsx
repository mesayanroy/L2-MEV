"use client";

import Link from "next/link";
import { useState } from "react";

const INSTALL_CMD = "npm install -g l2mev";
const INIT_CMD    = "l2mev init";

const QUICK_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/cli", label: "CLI" },
  { href: "/docs/api", label: "API" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Hero() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(`${INSTALL_CMD}\n${INIT_CMD}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="px-4 pb-20 pt-4 sm:pt-6">
      <div className="page-wrap text-center">
        <div className="voxel-scene" aria-hidden="true">
          <div className="voxel-face voxel-top" />
          <div className="voxel-face voxel-left" />
          <div className="voxel-face voxel-right" />
          <div className="voxel-core" />
        </div>

        <h1 className="mx-auto mt-6 max-w-5xl text-3xl uppercase tracking-wide text-gray-800 sm:text-5xl">
          Light is pioneering zk compression to scale Solana.
        </h1>

        <div className="mt-8 flex items-center justify-center">
          <Link href="/docs" className="classic-button">
            Learn More &gt;&gt;
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="classic-button">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded border border-gray-300 bg-gray-100 p-4 text-left font-mono text-sm text-gray-700">
          <p>
            <span className="text-blue-700">$</span> {INSTALL_CMD}
          </p>
          <p className="mt-2">
            <span className="text-blue-700">$</span> {INIT_CMD}
          </p>
          <button onClick={handleCopy} className="classic-button mt-4">
            {copied ? "Copied" : "Copy setup commands"}
          </button>
        </div>
      </div>
    </section>
  );
}
