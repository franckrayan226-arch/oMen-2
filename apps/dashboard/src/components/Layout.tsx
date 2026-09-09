import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/produits", label: "Produits", icon: MIconBox },
  { to: "/commandes", label: "Commandes", icon: MIconBag },
];

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-black/[0.07] bg-white px-4 py-6 sm:flex">
        <div className="px-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1d4ed8]">Omen Admin</p>
          <p className="mt-0.5 text-[15px] font-extrabold tracking-tight" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>
            Dashboard
          </p>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  isActive ? "bg-[#111] text-white" : "text-[#444] hover:bg-black/[0.04]"
                }`
              }
            >
              <n.icon />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2 px-2">
          <div className="rounded-xl bg-[#f6f5f3] p-3 text-[10.5px] leading-relaxed text-[#666] ring-1 ring-black/[0.04]">
            <p className="font-semibold text-[#111]">Sites</p>
            <p>Sneaker — localhost:3001</p>
            <p>Wellness — localhost:3002</p>
          </div>
          <button onClick={logout} className="text-[12px] font-medium text-[#888] transition hover:text-[#111]">
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <div className="sticky top-0 z-40 flex items-center gap-2 border-b border-black/[0.07] bg-white/90 px-4 py-3 backdrop-blur sm:hidden">
          <p className="text-[13px] font-extrabold" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>
            Omen Admin
          </p>
          <nav className="ml-auto flex gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-[12px] font-medium ${isActive ? "bg-[#111] text-white" : "text-[#444]"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <button onClick={logout} className="rounded-lg px-2 py-1.5 text-[12px] text-[#888]">
              Quitter
            </button>
          </nav>
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MIconBox() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
function MIconBag() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
