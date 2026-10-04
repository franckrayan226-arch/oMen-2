import { Link } from "react-router-dom";

const PERKS = [
  "Code promo personnel",
  "Réduction pour tes abonnés",
  "Commission après 15 ventes validées",
];

export function InfluencerCta() {
  return (
    <section className="mx-auto mt-6 max-w-7xl px-3 sm:mt-10 sm:px-6">
      <div className="glass-soft relative overflow-hidden rounded-3xl px-5 py-8 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#1d4ed8]/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#111]/5 blur-3xl" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1d4ed8] sm:text-[11px]">
              Programme influenceur
            </p>
            <h2
              className="mt-2 text-[26px] leading-tight text-[#111] sm:text-[34px]"
              style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}
            >
              Gagne de l&rsquo;argent avec ta communauté
            </h2>
            <p className="mt-3 max-w-[540px] text-[13px] leading-relaxed text-[#666] sm:text-[14px]">
              Crée ton code promo : tes abonnés profitent de -10% sur leurs paires, tu touches une
              commission sur chaque commande — reversée après 15 paiements validés avec ton code.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {PERKS.map((p) => (
                <li key={p} className="glass-chip rounded-full px-3.5 py-1.5 text-[11px] font-medium text-[#444]">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0">
            <Link
              to="/partenaires"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111] px-8 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-[#1d4ed8] md:w-auto"
            >
              Devenir influenceur
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
