import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const NAV_LINKS = [
  { to: "/catalogue", label: "Nouveautés" },
  { to: "/catalogue?marque=Nike", label: "Nike" },
  { to: "/catalogue?marque=Jordan", label: "Jordan" },
  { to: "/catalogue?marque=adidas", label: "adidas" },
  { to: "/catalogue?promo=true", label: "Promos" },
];

export function Navbar() {
  const items = useCart((s) => s.items);
  const badgePulse = useCart((s) => s.badgePulse);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 px-2 pt-2 sm:px-4 sm:pt-3">
      <nav className="glass mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full px-3 sm:h-16 sm:px-5">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <img src="/omen.shop.jpeg" alt="Omen Sneaker" className="h-12 w-12 rounded-full object-cover ring-2 ring-[#1d4ed8]/30 sm:h-14 sm:w-14" />
          <div className="leading-tight">
            <span className="block text-[14px] sm:text-[16px] font-black tracking-tight text-[#111]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Omen_Sneaker</span>
            <span className="block text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.25em] text-[#1d4ed8]">Dare to be different</span>
          </div>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.to + link.label} to={link.to} className="link-hover rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#666] transition-all duration-300 hover:scale-110 hover:text-[#111] active:scale-95">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <input type="search" placeholder="Rechercher..." className="input h-9 w-36 rounded-lg px-3 pr-8 text-[12px] text-[#111] placeholder:text-[#999] transition-all focus:w-48" />
            <svg className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          <Link to="/panier" className="glass-chip relative flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 active:scale-95" aria-label="Panier">
            <svg className="h-5 w-5 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1d4ed8] px-1 text-[10px] font-bold text-white ${badgePulse ? 'badge-animate' : ''}`}>{itemCount}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
