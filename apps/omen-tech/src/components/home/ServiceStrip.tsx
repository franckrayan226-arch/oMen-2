const ITEMS = [
  "Paiement à la livraison",
  "Livraison 24-48h",
  "Togo & Burkina Faso",
  "Garantie 12 mois",
  "Retours sous 7 jours",
];

export function ServiceStrip() {
  return (
    <div className="border-y border-[#e5e5e5] bg-[#111]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-5 lg:justify-between lg:px-10">
        {ITEMS.map((item) => (
          <span key={item} className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 shrink-0 bg-[#1d4ed8]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
