import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const TABS = [
  { key: "home", path: "/", label: "Accueil" },
  { key: "shop", path: "/catalogue", label: "Boutique" },
  { key: "fav", path: "/favoris", label: "Favoris" },
  { key: "cart", path: "/panier", label: "Panier" },
];

/* Icônes style iOS (SF Symbols, remplis) */
function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.03 3.14a1 1 0 011.94 0l8.05 3.66A1.5 1.5 0 0121.8 8.2v11.3a1.5 1.5 0 01-1.5 1.5H16.5v-6.2a1.5 1.5 0 00-1.5-1.5h-4a1.5 1.5 0 00-1.5 1.5v6.2H3.7a1.5 1.5 0 01-1.5-1.5V8.2a1.5 1.5 0 01.78-1.4z" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3.2" y="3.2" width="7.6" height="7.6" rx="2" />
      <rect x="13.2" y="3.2" width="7.6" height="7.6" rx="2" />
      <rect x="3.2" y="13.2" width="7.6" height="7.6" rx="2" />
      <rect x="13.2" y="13.2" width="7.6" height="7.6" rx="2" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 20.7l-1.3-1.18C5.7 15.06 2.75 12.37 2.75 9.05 2.75 6.36 4.86 4.25 7.5 4.25c1.5 0 2.94.7 3.87 1.79l.63.74.63-.74A5.01 5.01 0 0116.5 4.25c2.64 0 4.75 2.11 4.75 4.8 0 3.32-3 6.01-7.95 10.48L12 20.7z" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.7 6.2a4.3 4.3 0 018.6 0h2.45a1 1 0 01.98 1.17l-1.06 6.1A3.5 3.5 0 0115.2 19.6H8.8a3.5 3.5 0 01-3.47-3.06l-1.06-6.1A1 1 0 017.2 6.2zm1.8 0h5a2.5 2.5 0 00-5 0z" />
    </svg>
  );
}

const ICONS = [IconHome, IconGrid, IconHeart, IconBag];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const count = useCart((s) => s.items).reduce((sum, i) => sum + i.quantity, 0);

  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) =>
      t.path === "/" ? location.pathname === "/" : location.pathname.startsWith(t.path)
    )
  );

  return (
    <nav
      className="fixed inset-x-3 bottom-5 z-50 mx-auto max-w-[440px] md:hidden"
      aria-label="Navigation principale"
    >
      <div className="relative flex rounded-[26px] border border-white/60 bg-white/35 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(255,255,255,0.28)] backdrop-blur-2xl backdrop-saturate-150">
        {/* Bulle active en liquid glass */}
        <div
          className="pointer-events-none absolute bottom-1.5 left-1.5 top-1.5 w-[calc((100%-12px)/4)] rounded-[21px] border border-white/70 bg-gradient-to-b from-white/75 to-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(255,255,255,0.35),0_4px_14px_rgba(0,0,0,0.10)] backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />

        {TABS.map((tab, i) => {
          const Icon = ICONS[i];
          const active = i === activeIndex;
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className={`relative z-10 flex min-h-[56px] flex-1 flex-col items-center justify-center gap-[3px] transition-colors duration-200 ${
                active ? "text-[#111]" : "text-black/45 hover:text-black/70"
              }`}
            >
              <span className="relative">
                <Icon />
                {tab.key === "cart" && count > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#111] px-1 text-[10px] font-bold leading-none text-white">
                    {count}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] leading-none ${
                  active ? "font-bold" : "font-semibold opacity-80"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
