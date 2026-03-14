export function CtaBanner() {
  return (
    <section className="page-wrap px-0 py-12 sm:py-16">
      <div className="section-shell rounded p-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Your trades deserve to settle fairly
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-700">
          Install the CLI in under 30 seconds. No account required. Open source and
          community-audited.
        </p>

        <div className="mx-auto mt-8 max-w-sm overflow-hidden rounded border border-gray-300 bg-gray-100 font-mono text-sm">
          <div className="px-4 py-3 text-gray-700">
            <span className="text-blue-700">$</span>{" "}
            <span className="text-gray-900">npm install -g l2mev</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/docs"
            className="classic-button"
          >
            Get Started →
          </a>
          <a
            href="https://github.com/mesayanroy/L2-MEV"
            target="_blank"
            rel="noreferrer"
            className="classic-button"
          >
            Star on GitHub ⭐
          </a>
        </div>
      </div>
    </section>
  );
}
