export function CtaBanner() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-900/60 to-dark-card p-10 text-center shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white">
          Your trades deserve to settle fairly
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          Install the CLI in under 30 seconds. No account required. Open source and
          community-audited.
        </p>

        <div className="mx-auto mt-8 max-w-sm overflow-hidden rounded-xl border border-dark-border bg-dark-bg font-mono text-sm">
          <div className="px-4 py-3 text-slate-300">
            <span className="text-green-400">$</span>{" "}
            <span className="text-white">npm install -g l2mev</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/docs"
            className="rounded-lg bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Get Started →
          </a>
          <a
            href="https://github.com/mesayanroy/L2-MEV"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-dark-border px-8 py-3 font-semibold text-slate-300 transition hover:border-brand-500"
          >
            Star on GitHub ⭐
          </a>
        </div>
      </div>
    </section>
  );
}
