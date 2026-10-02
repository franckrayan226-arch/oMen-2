import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-[#d2d2d7]/60 bg-[#fbfbfd]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
              oMen <span className="text-[#0071e3]">Tech</span>
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#6e6e73]">
              Technologie & électronique. Les meilleurs produits au meilleur prix.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#86868b]">Boutique</p>
            <ul className="mt-3 space-y-2">
              <li><Link to="/catalogue" className="text-[13px] text-[#1d1d1f] transition-colors hover:text-[#0071e3]">Tous les produits</Link></li>
              <li><Link to="/favoris" className="text-[13px] text-[#1d1d1f] transition-colors hover:text-[#0071e3]">Favoris</Link></li>
              <li><Link to="/panier" className="text-[13px] text-[#1d1d1f] transition-colors hover:text-[#0071e3]">Panier</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#86868b]">Services</p>
            <ul className="mt-3 space-y-2 text-[13px] text-[#1d1d1f]">
              <li>Livraison rapide</li>
              <li>Paiement à la livraison</li>
              <li>Garantie 12 mois</li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#86868b]">Contact</p>
            <ul className="mt-3 space-y-2 text-[13px] text-[#1d1d1f]">
              <li>Lomé, Togo</li>
              <li>contact@omentech.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#d2d2d7]/60 pt-6">
          <p className="text-[12px] text-[#86868b]">
            © 2026 oMen Tech. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
