const ITEMS = [
  { title: "Livraison rapide", desc: "24 à 48h partout à Lomé." },
  { title: "Paiement à la livraison", desc: "Payez en espèces à la réception." },
  { title: "Garantie", desc: "12 mois sur chaque appareil." },
];

export function ServiceStrip() {
  return (
    <section className="border-y border-[#e5e5e5]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-[#e5e5e5] px-5 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
        {ITEMS.map((item) => (
          <div key={item.title} className="py-8 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">
              {item.title}
            </p>
            <p className="mt-2 text-[15px] text-[#555]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
