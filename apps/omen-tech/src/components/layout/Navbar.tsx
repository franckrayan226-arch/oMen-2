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
          className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-[#111] md:block"
        >
          Panier
          {count > 0 && (
            <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111] px-1 text-[10px] font-medium text-white">
              {count}
            </span>
          )}
        </Link>
      </nav>
      <div className="h-px bg-[#e5e5e5]" />
    </header>
  );
}
