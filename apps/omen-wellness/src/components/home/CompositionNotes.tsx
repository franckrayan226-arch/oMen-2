import { Reveal } from "@/components/ui/Reveal";

const NOTES = [
  {
    n: "A",
    title: "Minoxidil",
    text: "L'actif de référence. Prolonge la phase de croissance du follicule, densifie visiblement. Dosé à 5%, sans propylène glycol.",
  },
  {
    n: "B",
    title: "Caféine & biotine",
    text: "Le duo énergisant : microcirculation stimulée, kératine soutenue. Présent dans le shampooing et le sérum barbe.",
  },
  {
    n: "C",
    title: "Botanique",
    text: "Ricin, jojoba, nigelle, romarin. Huiles pressées à froid, choisies pour nourrir la fibre sans l'alourdir.",
  },
];

export function CompositionNotes() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-16">
      <div className="flex items-end justify-between">
        <div>
          <p className="label-mono text-[9px] text-[#b4552d] sm:text-[10px]">Composition</p>
          <h2 className="font-display mt-2 text-[24px] text-[#17211a] sm:text-[32px]">Ce qu'il y a dedans</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
        <Reveal className="sm:col-span-2">
          <div className="glass overflow-hidden rounded-3xl p-1.5">
            <img src="/img/home/ingredients.jpg" alt="Matières premières" className="aspect-[4/3] w-full rounded-[18px] object-cover" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="glass overflow-hidden rounded-3xl p-1.5">
            <img src="/img/home/texture.jpg" alt="Texture de sérum" className="aspect-[4/3] w-full rounded-[18px] object-cover" loading="lazy" />
          </div>
        </Reveal>
      </div>

      <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
        {NOTES.map((note) => (
          <Reveal key={note.n}>
            <div className="glass-soft h-full rounded-3xl p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a2a]/90 text-[12px] font-bold text-[#f4efe3] shadow-md">{note.n}</span>
                <span className="label-mono text-[8px] text-[#17211a]/40">Ingrédient</span>
              </div>
              <h3 className="font-display-italic mt-4 text-[18px] text-[#17211a] sm:text-[20px]">{note.title}</h3>
              <p className="mt-2.5 text-[11.5px] leading-relaxed text-[#17211a]/70">{note.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
