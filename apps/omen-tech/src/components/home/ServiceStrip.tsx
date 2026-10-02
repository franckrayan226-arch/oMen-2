const ITEMS = [
  "Orange Money & Moov Money",
  "Livraison 24-48h",
  "Burkina Faso",
  "Garantie 12 mois",
  "Retours sous 7 jours",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-bungee text-[13px] leading-none text-white sm:text-[15px]">
            {item}
          </span>
          <span className="font-bungee text-[12px] text-white/40">//</span>
        </span>
      ))}
    </div>
  );
}

export function ServiceStrip() {
  return (
    <div className="overflow-hidden border-y border-[#e5e5e5] bg-[#111] py-4">
      <div className="marquee-track" aria-hidden="true">
        <Row />
        <Row />
        <Row />
        <Row />
      </div>
      <span className="sr-only">
        Paiement Orange Money et Moov Money, livraison 24-48h au Burkina Faso,
        garantie 12 mois, retours sous 7 jours.
      </span>
    </div>
  );
}
