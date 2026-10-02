const ITEMS = [
  "Paiement à la livraison",
  "Livraison 24-48h",
  "Togo & Burkina Faso",
  "Garantie 12 mois",
  "Retours sous 7 jours",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-white/85">
            {item}
          </span>
          <span className="text-[11px] text-[#1d4ed8]">/</span>
        </span>
      ))}
    </div>
  );
}

export function ServiceStrip() {
  return (
    <div className="overflow-hidden border-y border-[#e5e5e5] bg-[#111] py-3.5">
      <div className="marquee-track" aria-hidden="true">
        <Row />
        <Row />
        <Row />
        <Row />
      </div>
      <span className="sr-only">
        Paiement à la livraison, livraison 24-48h au Togo et au Burkina Faso,
        garantie 12 mois, retours sous 7 jours.
      </span>
    </div>
  );
}
