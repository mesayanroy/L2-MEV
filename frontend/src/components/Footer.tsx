export function Footer() {
  return (
    <footer className="px-4 pb-10 pt-16">
      <div className="page-wrap border-t border-gray-300 pt-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">L2-MEV Shield</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
              Open infrastructure for safer Solana execution. Detect threats, route privately,
              and protect every swap against toxic order flow.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            <p>© {new Date().getFullYear()} L2-MEV Shield</p>
            <a
              href="https://github.com/mesayanroy/L2-MEV"
              className="mt-2 inline-block text-gray-700 transition hover:text-gray-900"
              target="_blank"
              rel="noreferrer"
            >
              View project on GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
