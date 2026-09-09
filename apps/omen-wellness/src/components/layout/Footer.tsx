import { useState } from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="mx-auto max-w-7xl px-3 pb-28 sm:px-6 sm:pb-10">
      <div className="glass-soft rounded-3xl px-4 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-4">
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Omen Wellness" className="h-10 w-10 rounded-lg" />
              <div className="leading-none">
                <span className="font-display block text-[16px] tracking-tight text-[#17211a]">Omen&nbsp;Wellness</span>
                <span className="mt-1 block text-[7.5px] font-semibold uppercase tracking-[0.34em] text-[#b4552d]">Rituels essentiels</span>
              </div>
            </div>
            <p className="mt-4 max-w-[300px] text-[11px] leading-relaxed text-[#17211a]/70">
              Préparé en petites séries. Minoxidil, sérums et outils — livrés à Lomé sous 24h, Togo & Burkina via agence.
            </p>
          </div>

          <div>
            <button
              onClick={() => toggleSection("info")}
              className="mb-3 flex w-full items-center justify-between text-[9.5px] font-bold uppercase tracking-[0.22em] text-[#17211a]/60 sm:cursor-default sm:justify-start"
            >
              Le service
              <svg className={`h-3.5 w-3.5 transition-transform duration-300 sm:hidden ${openSection === "info" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul className={`space-y-2 text-[11px] text-[#17211a]/70 ${openSection === "info" ? "block" : "hidden"} sm:block`}>
              <li>Livraison 24h à Lomé</li>
              <li>Agences Togo & Burkina</li>
              <li>Paiement : Wave · OM · MoMo</li>
              <li>Produits scellés d'origine</li>
            </ul>
          </div>

          <div>
            <button
              onClick={() => toggleSection("liens")}
              className="mb-3 flex w-full items-center justify-between text-[9.5px] font-bold uppercase tracking-[0.22em] text-[#17211a]/60 sm:cursor-default sm:justify-start"
            >
              Navigation
              <svg className={`h-3.5 w-3.5 transition-transform duration-300 sm:hidden ${openSection === "liens" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul className={`space-y-2 text-[11px] text-[#17211a]/70 ${openSection === "liens" ? "block" : "hidden"} sm:block`}>
              <li><Link to="/catalogue" className="link-underline hover:text-[#b4552d]">Catalogue</Link></li>
              <li><Link to="/favoris" className="link-underline hover:text-[#b4552d]">Favoris</Link></li>
              <li><Link to="/profil" className="link-underline hover:text-[#b4552d]">Profil</Link></li>
              <li><Link to="/panier" className="link-underline hover:text-[#b4552d]">Panier</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-deep mx-auto mt-3 flex max-w-7xl flex-col items-center justify-between gap-2 rounded-full px-6 py-3.5 sm:flex-row">
        <p className="text-[8.5px] uppercase tracking-[0.22em] text-[#f4efe3]/65">© 2026 Omen Wellness — marque sœur d'Omen Sneaker</p>
        <p className="text-[8.5px] uppercase tracking-[0.22em] text-[#f4efe3]/65">Préparé à Lomé</p>
      </div>
    </footer>
  );
}
