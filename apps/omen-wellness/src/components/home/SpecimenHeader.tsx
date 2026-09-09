import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";

const INDEX_ROWS = [
  { ref: "N°01", name: "Minoxidil 5%", detail: "anti-chute · sans propylène glycol", to: "/produit/minoxidil-5" },
  { ref: "N°02", name: "Sérum Croissance Barbe", detail: "barbe · biotine & caféine", to: "/produit/serum-croissance-barbe" },
  { ref: "N°03", name: "Sérum Cuir Chevelu", detail: "soin · niacinamide & zinc", to: "/produit/serum-cuir-chevelu" },
  { ref: "N°04", name: "Huile Rituel Nuit", detail: "botanique · pressée à froid", to: "/produit/huile-rituel-nuit" },
];

export function SpecimenHeader() {
  return (
    <section className="mx-auto max-w-7xl px-3 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-10">
      <Reveal>
        <div className="glass mx-auto max-w-3xl rounded-3xl px-5 py-8 text-center sm:px-10 sm:py-12">
          <p className="label-mono text-[9px] text-[#b4552d] sm:text-[10px]">Omen Wellness — préparations capillaires</p>
          <h1 className="font-display mx-auto mt-4 max-w-[15ch] text-[32px] leading-[1.06] text-[#17211a] sm:text-[52px]">
            Le geste précis, la formule courte.
          </h1>
          <p className="mx-auto mt-5 max-w-[48ch] text-[12px] leading-relaxed text-[#17211a]/70 sm:text-[13px]">
            Actifs dosés, rituels expliqués, rien de plus. Chaque préparation est livrée scellée, avec sa notice.
          </p>
        </div>
      </Reveal>

      <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-5 sm:gap-4">
        <Reveal className="sm:col-span-3">
          <Link to="/produit/minoxidil-5" className="group relative block overflow-hidden rounded-3xl">
            <img src="/img/home/ouverture-1.jpg" alt="Minoxidil 5%" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl px-4 py-3 glass">
              <span className="label-mono text-[9px]">N°01 — Minoxidil 5%</span>
              <span className="label-mono text-[9px] text-[#b4552d]">Voir la fiche →</span>
            </div>
          </Link>
        </Reveal>
        <Reveal delay={140} className="sm:col-span-2">
          <Link to="/catalogue" className="group relative block h-full overflow-hidden rounded-3xl">
            <img src="/img/home/ouverture-2.jpg" alt="La routine complète" className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl px-4 py-3 glass">
              <span className="label-mono text-[9px]">La routine</span>
              <span className="label-mono text-[9px] text-[#b4552d]">Catalogue →</span>
            </div>
          </Link>
        </Reveal>
      </div>

      <Reveal delay={100}>
        <div className="glass-soft mt-4 overflow-hidden rounded-3xl sm:mt-6">
          {INDEX_ROWS.map((row) => (
            <Link key={row.ref} to={row.to} className="hover-row group flex items-baseline justify-between gap-3 border-b border-white/40 px-4 py-3.5 last:border-0 sm:px-6 sm:py-4">
              <div className="flex items-baseline gap-4 sm:gap-8">
                <span className="label-mono w-10 shrink-0 text-[9px] text-[#b4552d]">{row.ref}</span>
                <span className="font-display-italic text-[15px] text-[#17211a] sm:text-[19px]">{row.name}</span>
                <span className="hidden text-[10px] uppercase tracking-[0.14em] text-[#17211a]/50 md:inline">{row.detail}</span>
              </div>
              <span className="text-[13px] text-[#17211a]/40 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
