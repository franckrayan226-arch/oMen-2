import { useState } from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="mt-auto px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="glass-soft mx-auto grid max-w-7xl grid-cols-2 gap-6 rounded-3xl px-3 py-8 sm:grid-cols-3 sm:px-6 sm:py-10">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <img src="/omen.shop.jpeg" alt="Omen" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <span className="block text-[15px] font-black tracking-tight text-[#111]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Omen_Sneaker</span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8]">Dare to be different</span>
            </div>
          </div>
          <p className="text-[12px] leading-relaxed text-[#666] max-w-[260px] sm:text-[13px]">Sneakers authentiques. Livraison rapide Lomé & Ouaga. Togo & Burkina Faso.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://wa.me/22890000000" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-110" aria-label="WhatsApp">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a href="https://snapchat.com/add/omen_sneaker" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFC00] text-black transition-transform hover:scale-110" aria-label="Snapchat">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.015 2.5c-4.136 0-7.5 3.364-7.5 7.5 0 1.637.528 3.158 1.424 4.4l-.375 3.274 3.194-.587c1.108.532 2.355.834 3.677.834 4.136 0 7.5-3.364 7.5-7.5s-3.364-7.5-7.5-7.5zm-.007 12.5c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@omen_sneaker" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#000000] text-white transition-transform hover:scale-110" aria-label="TikTok">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="sm:block">
          <button
            onClick={() => toggleSection('livraison')}
            className="mb-2 flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-[#999] sm:text-[11px] sm:mb-2 sm:cursor-default sm:justify-start"
          >
            Livraison
            <svg className={`h-4 w-4 transition-transform duration-300 sm:hidden ${openSection === 'livraison' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <ul className={`space-y-1 text-[11px] text-[#666] sm:space-y-1.5 sm:text-[12px] ${openSection === 'livraison' ? 'block' : 'hidden'} sm:block`}>
            <li>Sous 24h à Lomé & Ouaga</li>
            <li>Autres villes via agence</li>
            <li>Wave / Orange / MTN</li>
            <li>GeniusPay</li>
          </ul>
        </div>

        <div className="sm:block">
          <button
            onClick={() => toggleSection('liens')}
            className="mb-2 flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-[#999] sm:text-[11px] sm:mb-2 sm:cursor-default sm:justify-start"
          >
            Liens
            <svg className={`h-4 w-4 transition-transform duration-300 sm:hidden ${openSection === 'liens' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <ul className={`space-y-1 ${openSection === 'liens' ? 'block' : 'hidden'} sm:block`}>
            {[{ to: "/catalogue", label: "Nouveautés" }, { to: "/catalogue?promo=true", label: "Promos" }, { to: "/favoris", label: "Favoris" }, { to: "/profil", label: "Profil" }, { to: "/confidentialite", label: "Confidentialité" }].map((l) => (
              <li key={l.label}><Link to={l.to} className="text-[11px] text-[#666] transition-colors hover:text-[#1d4ed8] sm:text-[12px]">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="glass-deep mx-auto mt-2 rounded-full py-3 text-center text-[10px] text-white/60">© 2026 OMEN SNEAKER</div>
    </footer>
  );
}
