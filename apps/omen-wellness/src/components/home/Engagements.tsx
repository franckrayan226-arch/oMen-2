const ITEMS = [
  { n: "01", title: "Formules courtes", text: "Listes d'ingrédients lisibles. Chaque actif est annoncé, dosé, justifié." },
  { n: "02", title: "Conseil suivi", text: "Avant l'achat, la routine se discute sur WhatsApp. Gratuit, sans engagement." },
  { n: "03", title: "Livraison 24h", text: "Ouagadougou sous 24h. Bobo, Koudougou, Kaya et le pays via agence partenaire." },
  { n: "04", title: "Paiement mobile", text: "Orange Money et Moov Money, payés par USSD avant livraison." },
];

export function Engagements() {
  return (
    <section className="mx-auto max-w-7xl px-3 pb-10 sm:px-6 sm:pb-16">
      <div className="glass-soft rounded-3xl px-4 py-6 sm:px-8 sm:py-8">
        <p className="label-mono text-[9px] text-[#b4552d] sm:text-[10px]">Le service</p>
        <div className="mt-4">
          {ITEMS.map((item) => (
            <div key={item.n} className="grid gap-1.5 border-t border-white/45 py-4 sm:grid-cols-12 sm:items-baseline sm:gap-4 sm:py-5">
              <span className="label-mono text-[9px] text-[#b4552d] sm:col-span-1">{item.n}</span>
              <h3 className="font-display text-[16.5px] text-[#17211a] sm:col-span-4 sm:text-[19px]">{item.title}</h3>
              <p className="text-[11.5px] leading-relaxed text-[#17211a]/70 sm:col-span-7">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
