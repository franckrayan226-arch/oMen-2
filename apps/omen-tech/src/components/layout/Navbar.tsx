import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Brand } from "./Brand";

export function Navbar() {
  const items = useCart((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Brand />

        <div className="hidden items-center gap-8 md:flex">
          {[
            { to: "/", label: "Accueil" },
            { to: "/catalogue", label: "Boutique" },
            { to: "/favoris", label: "Favoris" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                location.pathname === l.to
                  ? "text-[#111]"
                  : "text-[#999] hover:text-[#111]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          to="/panier"
          aria-label="Panier"
          className="relative hidden text-[#111] transition-opacity duration-200 hover:opacity-60 md:block"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[22px] w-[22px]"
            aria-hidden="true"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111] px-1 text-[10px] font-medium text-white">
              {count}
            </span>
          )}
        </Link>
      </nav>
      <div className="h-px bg-[#e5e5e5]" />
    </header>
  );
}
