import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

const TABS = [
  { key: "home", path: "/", label: "Accueil" },
  { key: "shop", path: "/catalogue", label: "Boutique" },
  { key: "fav", path: "/favoris", label: "Favoris" },
  { key: "cart", path: "/panier", label: "Panier" },
];

const ITEM_W = 52;

function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l1 13H5L6 7z" />
      <path d="M9 7a3 3 0 016 0" />
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
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:hidden"
      aria-label="Navigation principale"
    >
      <div className="relative flex items-center rounded-full border border-[#e5e5e5] bg-white/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <div
          className="absolute top-1.5 h-[52px] w-[52px] rounded-full bg-[#111] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(${activeIndex * ITEM_W + 6}px)` }}
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
              className={`relative flex h-[52px] w-[52px] flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                active ? "text-white" : "text-[#999] hover:text-[#111]"
              }`}
            >
              <span className="relative">
                <Icon />
                {tab.key === "cart" && count > 0 && (
                  <span
                    className={`absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                      active ? "bg-white text-[#111]" : "bg-[#111] text-white"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </span>
              <span className={`text-[9px] font-medium ${active ? "opacity-100" : "opacity-0"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
