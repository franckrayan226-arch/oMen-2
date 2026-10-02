import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const items = useCart((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-[#d2d2d7]/60 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
            oMen <span className="text-[#0071e3]">Tech</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {[
            { to: "/", label: "Accueil" },
            { to: "/catalogue", label: "Produits" },
            { to: "/favoris", label: "Favoris" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[13px] font-medium transition-colors duration-200 ${
                location.pathname === l.to ? "text-[#1d1d1f]" : "text-[#6e6e73] hover:text-[#1d1d1f]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/panier"
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#f0f0f2]"
            aria-label="Panier"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#1d1d1f]">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0071e3] px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
