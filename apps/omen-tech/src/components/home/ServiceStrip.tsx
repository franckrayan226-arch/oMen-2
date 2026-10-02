const SERVICES = [
  { icon: "🚚", title: "Livraison rapide", text: "Livré en 24-48h partout au Togo" },
  { icon: "💳", title: "Paiement à la livraison", text: "Payez à la réception, sans risque" },
  { icon: "🛡️", title: "Garantie 12 mois", text: "Sur tous nos produits électroniques" },
  { icon: "🔄", title: "Retour 7 jours", text: "Vous changez d'avis ? On reprend." },
];

export function ServiceStrip() {
  return (
    <section className="border-y border-[#d2d2d7]/60 bg-[#fbfbfd]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div key={s.title} className="text-center">
            <div className="text-[28px]">{s.icon}</div>
            <p className="mt-2 text-[13px] font-semibold text-[#1d1d1f]">{s.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#6e6e73]">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
