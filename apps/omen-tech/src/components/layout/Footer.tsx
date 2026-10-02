import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-[#fafafa]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="" className="h-8 w-8" />
              <p className="text-[15px] font-semibold tracking-tight">oMen Tech</p>
            </div>
            <p className="mt-3 max-w-[260px] text-[13px] leading-relaxed text-[#999]">
              Du technologique de consommation, sélectionné avec soin.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#999]">Boutique</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/catalogue" className="text-[13px] text-[#555] transition-colors hover:text-[#111]">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link to="/favoris" className="text-[13px] text-[#555] transition-colors hover:text-[#111]">
                  Favoris
                </Link>
              </li>
              <li>
                <Link to="/panier" className="text-[13px] text-[#555] transition-colors hover:text-[#111]">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#999]">Infos</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#555]">
              <li>Livraison Togo &amp; Burkina Faso</li>
              <li>Paiement à la livraison</li>
              <li>Garantie 12 mois</li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#999]">Contact</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#555]">
              <li>Lomé (TG) &amp; Ouagadougou (BF)</li>
              <li>contact@omentech.tg</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[#e5e5e5] pt-6">
          <p className="text-[12px] text-[#999]">&copy; 2026 oMen Tech</p>
        </div>
      </div>
    </footer>
  );
}
