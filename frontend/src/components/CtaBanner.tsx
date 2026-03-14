import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-24">
      <div className="page-wrap">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-10 text-center">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[200px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[80px]" />
          </div>

          <p className="badge relative mb-4 inline-flex text-xs">Open Source &amp; Free</p>
          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
            Your trades deserve to settle fairly
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base leading-8 text-slate-400">
            Install the CLI in under 30 seconds. No account required. Open source and
            community-audited.
          </p>

          <div className="relative mx-auto mt-8 max-w-sm overflow-hidden rounded-xl border border-[rgba(99,102,241,0.2)] bg-[rgba(0,0,0,0.4)] px-5 py-4 backdrop-blur-sm">
            <span className="font-mono text-sm">
              <span className="text-indigo-400">$ </span>
              <span className="text-slate-300">npm install -g l2mev</span>
            </span>
          </div>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/docs" className="btn-primary px-6 py-3 text-sm font-semibold">
              Get Started →
            </Link>
            <a
              href="https://github.com/mesayanroy/L2-MEV"
              target="_blank"
              rel="noreferrer"
              className="classic-button px-6 py-3 text-sm"
            >
              Star on GitHub ⭐
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
