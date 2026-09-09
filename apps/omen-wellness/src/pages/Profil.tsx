import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";

export default function Profil() {
  const cartItems = useCart((s) => s.items);
  const favItems = useFavorites((s) => s.items);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-12">
          <div className="flex items-center gap-4 px-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1e3a2a] text-[22px] font-bold text-[#f4efe3] shadow-lg sm:h-20 sm:w-20">
              W
            </div>
            <div>
              <p className="label-mono text-[8.5px] text-[#b4552d]">Compte client</p>
              <h1 className="font-display mt-1.5 text-[22px] text-[#17211a] sm:text-[26px]">Omen Wellness</h1>
              <p className="mt-0.5 text-[11px] text-[#17211a]/60">Lomé, Togo</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8">
            <Link to="/panier" className="glass rounded-3xl p-5 text-center transition-transform hover:-translate-y-0.5">
              <p className="text-[24px] font-bold text-[#b4552d]">{cartItems.reduce((s, i) => s + i.quantity, 0)}</p>
              <p className="label-mono mt-1 text-[8.5px] text-[#17211a]/60">Panier</p>
            </Link>
            <Link to="/favoris" className="glass rounded-3xl p-5 text-center transition-transform hover:-translate-y-0.5">
              <p className="text-[24px] font-bold text-[#b4552d]">{favItems.length}</p>
              <p className="label-mono mt-1 text-[8.5px] text-[#17211a]/60">Favoris</p>
            </Link>
          </div>

          <div className="glass-soft mt-4 overflow-hidden rounded-3xl">
            {[
              { to: "/catalogue", label: "Catalogue", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> },
              { to: "/favoris", label: "Mes favoris", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg> },
              { to: "/panier", label: "Mon panier", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg> },
            ].map((row, idx) => (
              <Link key={row.label} to={row.to} className={`hover-row flex items-center gap-4 px-5 py-4 ${idx > 0 ? "border-t border-white/50" : ""}`}>
                <span className="text-[#1e3a2a]">{row.icon}</span>
                <span className="text-[12px] font-medium text-[#17211a]">{row.label}</span>
                <span className="ml-auto text-[13px] text-[#17211a]/40">→</span>
              </Link>
            ))}
          </div>

          <div className="glass-soft mt-4 rounded-3xl p-5">
            <p className="label-mono text-[8.5px] text-[#17211a]/50">Contact</p>
            <p className="mt-2 text-[11.5px] text-[#17211a]/70">Conseil & commandes : WhatsApp</p>
            <p className="text-[11.5px] text-[#17211a]/70">Lomé, Togo — Ouagadougou, Burkina Faso</p>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
