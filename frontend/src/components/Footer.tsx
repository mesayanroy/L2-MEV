export function Footer() {
  return (
    <footer className="border-t border-dark-border py-8 text-center text-sm text-slate-500">
      <p>
        © {new Date().getFullYear()} L2-MEV Shield · Open source MEV protection for Solana ·{" "}
        <a
          href="https://github.com/mesayanroy/L2-MEV"
          className="underline hover:text-slate-300"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
