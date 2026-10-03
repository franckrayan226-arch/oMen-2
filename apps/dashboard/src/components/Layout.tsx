import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api";

const NAV = [
  { to: "/produits", label: "Produits", icon: IconBox },
  { to: "/categories", label: "Catégories", icon: IconTag },
  { to: "/commandes", label: "Commandes", icon: IconBag },
  { to: "/partenaires", label: "Partenaires", icon: IconUsers },
];

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .notifications()
        .then((r) => {
          if (alive) setUnread(r.unreadCount);
        })
        .catch(() => {});
    load();
    const onUpdated = () => load();
    const interval = window.setInterval(load, 60000);
    window.addEventListener("omen-notif-updated", onUpdated);
    return () => {
      alive = false;
      window.clearInterval(interval);
      window.removeEventListener("omen-notif-updated", onUpdated);
    };
  }, [location.pathname]);

  const pageTitle =
    location.pathname.startsWith("/produits") && location.pathname !== "/produits"
      ? location.pathname.includes("nouveau")
        ? "Nouveau produit"
        : "Modifier"
      : location.pathname.startsWith("/categories")
      ? "Catégories"
      : location.pathname.startsWith("/commandes")
      ? "Commandes"
      : location.pathname.startsWith("/partenaires")
      ? "Partenaires"
      : "Produits";

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar desktop ── */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-black/[0.07] bg-white sm:flex">
        <div className="px-5 pb-4 pt-6">
          <p className="text-[15px] font-extrabold tracking-tight">oMen Admin</p>
          <p className="mt-0.5 text-[11.5px] text-[#888]">Gestion des 3 boutiques</p>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex min-h-[48px] items-center gap-3 rounded-xl px-3.5 text-[14.5px] font-semibold transition ${
                  isActive ? "bg-[#1d4ed8] text-white" : "text-[#444] hover:bg-black/[0.04]"
                }`
              }
            >
              <n.icon />
              {n.label}
              {n.to === "/partenaires" && unread > 0 && (
                <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1d4ed8] px-1.5 text-[11px] font-bold text-white">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <button
            onClick={logout}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-black/10 text-[14px] font-semibold text-[#666] transition hover:bg-black/[0.03] hover:text-[#111]"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* ── Zone principale ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-black/[0.07] bg-white/95 px-4 backdrop-blur sm:hidden">
          <div>
            <p className="text-[15px] font-extrabold tracking-tight">oMen Admin</p>
          </div>
          <button
            onClick={logout}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#888] transition hover:bg-black/[0.05] hover:text-[#111]"
            aria-label="Se déconnecter"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </header>

        <main className="min-w-0 flex-1 px-4 pb-32 pt-5 sm:px-8 sm:pb-10 sm:pt-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-5 sm:hidden">
              <h1 className="text-[22px] font-extrabold tracking-tight">{pageTitle}</h1>
            </div>
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Onglets bas (mobile) ── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.07] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
        aria-label="Navigation"
      >
        <div className="mx-auto flex max-w-md">
          {NAV.map((n) => {
            const active = location.pathname.startsWith(n.to);
            return (
              <button
                key={n.to}
                onClick={() => navigate(n.to)}
                className={`flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 transition ${
                  active ? "text-[#1d4ed8]" : "text-[#999]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <n.icon />
                <span className="flex items-center gap-1 text-[11.5px] font-semibold">
                  {n.label}
                  {n.to === "/partenaires" && unread > 0 && (
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1d4ed8] px-1 text-[10px] font-bold text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </span>
                <span
                  className={`h-1 w-6 rounded-full transition ${
                    active ? "bg-[#1d4ed8]" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function IconBox() {
  return (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l1 13H5L6 7z" />
      <path d="M9 7a3 3 0 016 0" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
