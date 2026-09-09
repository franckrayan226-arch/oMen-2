import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const NAV_LINKS = [
  { to: "/catalogue", label: "Catalogue" },
  { to: "/catalogue?cat=Anti-chute", label: "Anti-chute" },
  { to: "/catalogue?cat=Barbe", label: "Barbe" },
  { to: "/catalogue?cat=Rituels", label: "Rituels" },
  { to: "/catalogue?cat=Accessoires", label: "Outils" },
];

export function Navbar() {
  const items = useCart((s) => s.items);
  const badgePulse = useCart((s) => s.badgePulse);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav className="glass mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl px-4 sm:h-[68px] sm:rounded-full sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src="/logo.svg" alt="Omen Wellness" className="h-9 w-9 rounded-lg sm:h-10 sm:w-10" />
          <div className="leading-none">
            <span className="font-display block text-[17px] tracking-tight text-[#17211a] sm:text-[19px]">Omen&nbsp;Wellness</span>
            <span className="mt-1 block text-[7.5px] font-semibold uppercase tracking-[0.34em] text-[#b4552d] sm:text-[8.5px]">Rituels essentiels</span>
          </div>
        </Link>

        <div className="hidden items-center lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="rounded-full px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.18em] text-[#17211a]/70 transition-colors hover:bg-white/50 hover:text-[#17211a]">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <input type="search" placeholder="RECHERCHER" className="glass-input h-9 w-36 rounded-full px-4 pr-9 text-[10px] uppercase tracking-[0.12em] transition-all focus:w-48" />
            <svg className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#17211a]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          <Link to="/panier" className="glass relative flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95" aria-label="Panier">
            <svg className="h-[18px] w-[18px] text-[#17211a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#b4552d] px-1 text-[9px] font-bold text-[#fff7ee] shadow-md ${badgePulse ? "badge-animate" : ""}`}>{itemCount}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
