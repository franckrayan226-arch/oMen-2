const SERVICES = [
  {
    title: "Livraison 24h",
    text: "Lomé & Ouagadougou sous 24h. Kara, Bobo, Kpalimé via agence partenaire.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h2m8 0h4m4 0h2v-3.5a1 1 0 00-.6-.9L19 10.5 17.5 8H14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Paires authentiques",
    text: "Chaque paire est vérifiée à la main avant expédition. Scellée d'origine.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3l7 4v5c0 4.5-3 8.5-7 9-4-.5-7-4.5-7-9V7l7-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Paiement local",
    text: "Wave, Orange Money, MTN MoMo, GeniusPay. En ligne ou à la livraison.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: "Conseil direct",
    text: "Une question sur une paire ou ta taille ? WhatsApp, réponse rapide.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function ServiceStrip() {
  return (
    <section className="mx-auto mt-12 max-w-7xl px-3 sm:mt-16 sm:px-6">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="glass-soft rounded-2xl p-4 transition-transform duration-500 hover:-translate-y-1 sm:p-5"
            style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            <div className="glass-chip flex h-9 w-9 items-center justify-center rounded-full text-[#1d4ed8]">
              {s.icon}
            </div>
            <h3 className="mt-3 text-[13px] font-bold text-[#111] sm:text-[14px]">{s.title}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-[#666] sm:text-[12px]">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
