import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  { n: "01", title: "Préparer", text: "Shampooing doux, deux fois par semaine. Une base saine avant tout actif." },
  { n: "02", title: "Traiter", text: "1 ml de minoxidil matin et soir. Application précise, massage trente secondes." },
  { n: "03", title: "Ancrer", text: "Sérum apaisant au soir. On calme le cuir chevelu, on tient le résultat." },
];

export function RitualSteps() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
      <Reveal>
        <div className="glass-deep overflow-hidden rounded-3xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-4 sm:p-6">
              <div className="overflow-hidden rounded-2xl">
                <img src="/img/home/rituel.jpg" alt="Protocole capillaire" className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:h-full" loading="lazy" />
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 pb-8 sm:p-10 lg:pl-0 lg:pr-12">
              <p className="label-mono text-[9px] text-[#e0a37f] sm:text-[10px]">Le protocole</p>
              <h2 className="font-display mt-3 text-[26px] leading-tight sm:text-[36px]">Trois gestes,<br />deux fois par jour.</h2>
              <div className="mt-7">
                {STEPS.map((s) => (
                  <div key={s.n} className="flex gap-5 border-t border-white/12 py-4 last:border-b last:border-white/12">
                    <span className="font-display-italic shrink-0 text-[15px] text-[#e0a37f]">{s.n}</span>
                    <div>
                      <h3 className="label-mono text-[10px]">{s.title}</h3>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-[#f4efe3]/70">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[9.5px] uppercase tracking-[0.16em] text-[#f4efe3]/45">Chaque fiche produit détaille son protocole complet.</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
