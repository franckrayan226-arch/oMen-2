import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";

export function LifestyleBento() {
  return (
    <section className="mx-auto mt-16 sm:mt-24 mb-8 max-w-7xl px-3 sm:px-6">
      <Reveal>
        <div className="mb-6 sm:mb-10 text-center sm:text-left">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8]">L'Univers</p>
          <h2 className="mt-2 text-[32px] sm:text-[48px] text-[#111]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontWeight: 800, lineHeight: 1 }}>Dare to be<br/>Different.</h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 auto-rows-[280px] sm:auto-rows-[320px]">
        {/* Main large block */}
        <Reveal className="sm:col-span-2 sm:row-span-2 h-full">
          <div className="relative rounded-3xl overflow-hidden glass group h-full">
            <div className="absolute inset-0 bg-[#111]" />
            <img src="/shoes/nike-air-force-1-og.jpg" alt="Nike Air Force 1" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            
            <div className="absolute bottom-0 left-0 p-6 sm:p-12 w-full flex flex-col justify-end">
              <h3 className="text-white text-[28px] sm:text-[48px] font-bold leading-tight mb-4" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Streetwear<br/>Authentique</h3>
              <p className="text-white/80 text-[14px] sm:text-[16px] max-w-sm mb-8">Affirmez votre identité avec notre sélection exclusive des meilleures paires de sneakers au Togo et au Burkina Faso.</p>
              <Link to="/catalogue" className="w-fit rounded-full bg-white text-black px-8 py-3.5 text-[14px] font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
                Explorer la collection
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Small top right block */}
        <Reveal delay={100} className="h-full">
          <div className="relative rounded-3xl overflow-hidden glass group h-full shadow-lg shadow-black/5" style={{ border: "1px solid #e0d6d0" }}>
            <img src="/shoes/lv-trainer.jpg" alt="Louis Vuitton LV Trainer" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/55 to-white/20" />
            <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
            <div className="flex justify-between items-start">
              <h3 className="text-[#111] text-[22px] sm:text-[28px] font-bold" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Éditions<br/>Limitées</h3>
              <Link to="/catalogue?promo=true" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111] text-white transition-transform duration-300 group-hover:rotate-45 hover:scale-110">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 19L19 5M19 5v10M19 5H9" /></svg>
              </Link>
            </div>
              <p className="text-[#333] text-[13px] sm:text-[15px] leading-relaxed">Les drops les plus attendus du moment, disponibles en quantités extrêmement limitées.</p>
            </div>
          </div>
        </Reveal>

        {/* Small bottom right block */}
        <Reveal delay={200} className="h-full">
          <div className="relative rounded-3xl overflow-hidden glass group bg-[#1d4ed8] h-full shadow-lg shadow-[#1d4ed8]/20 border border-white/20">
            <img src="/shoes/jordan-1.jpg" alt="Jordan 1" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
              <h3 className="text-white text-[22px] sm:text-[28px] font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>L'Héritage<br/>Jordan</h3>
              <Link to="/catalogue?marque=Jordan" className="text-white/90 text-[14px] font-semibold underline underline-offset-4 hover:text-white transition-colors w-fit">
                Découvrir la marque
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
