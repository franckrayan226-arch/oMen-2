import { Link, useLocation } from "react-router-dom";

const TABS = [
  { to: "/", label: "Accueil", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg> },
  { to: "/catalogue", label: "Catalogue", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> },
  { to: "/favoris", label: "Favoris", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg> },
  { to: "/panier", label: "Panier", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg> },
  { to: "/profil", label: "Profil", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
];

export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-2 left-2 right-2 z-50 safe-bottom sm:hidden" aria-label="Navigation">
      <div className="glass flex items-center justify-around rounded-full px-1 py-1.5">
        {TABS.map((tab) => {
          const isActive = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to.split("?")[0]);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center gap-0.5 rounded-full px-2 py-1 min-w-[48px] transition-all duration-300 ${isActive ? "text-[#1d4ed8]" : "text-[#999]"}`}
              style={{ transform: isActive ? "translateY(-2px)" : undefined, transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.icon}
              <span className="text-[9px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
