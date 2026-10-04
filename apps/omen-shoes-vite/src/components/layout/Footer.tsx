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
          <p className="text-[12px] leading-relaxed text-[#666] max-w-[260px] sm:text-[13px]">Sneakers authentiques. Livraison rapide Ouaga &amp; Bobo. Burkina Faso.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://wa.me/22890000000" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-110" aria-label="WhatsApp">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a href="https://snapchat.com/add/omen_sneaker" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFC00] text-black transition-transform hover:scale-110" aria-label="Snapchat">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/omen_sneaker" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E1306C] text-white transition-transform hover:scale-110" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
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
            <li>Sous 24h à Ouaga &amp; Bobo</li>
            <li>Autres villes via agence</li>
            <li>Orange Money / Moov Money</li>
            <li>Paiement Orange Money / Moov Money</li>
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
            {[{ to: "/catalogue", label: "Nouveautés" }, { to: "/catalogue?promo=true", label: "Promos" }, { to: "/favoris", label: "Favoris" }, { to: "/profil", label: "Profil" }, { to: "/partenaires", label: "Devenir influenceur" }, { to: "/confidentialite", label: "Confidentialité" }].map((l) => (
              <li key={l.label}><Link to={l.to} className="text-[11px] text-[#666] transition-colors hover:text-[#1d4ed8] sm:text-[12px]">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="glass-deep mx-auto mt-2 rounded-full py-3 text-center text-[10px] text-white/60">© 2026 OMEN SNEAKER</div>
    </footer>
  );
}
