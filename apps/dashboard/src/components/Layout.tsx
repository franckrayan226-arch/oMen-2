import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/produits", label: "Produits", icon: IconBox },
  { to: "/commandes", label: "Commandes", icon: IconBag },
];

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle =
    location.pathname.startsWith("/produits") && location.pathname !== "/produits"
      ? location.pathname.includes("nouveau")
        ? "Nouveau produit"
        : "Modifier"
      : location.pathname.startsWith("/commandes")
      ? "Commandes"
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
                <span className="text-[11.5px] font-semibold">{n.label}</span>
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
function IconBag() {
  return (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l1 13H5L6 7z" />
      <path d="M9 7a3 3 0 016 0" />
    </svg>
  );
}
