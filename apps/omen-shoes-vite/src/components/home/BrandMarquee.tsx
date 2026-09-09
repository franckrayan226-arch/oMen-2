const BRANDS = ["Nike", "Jordan", "adidas", "New Balance", "Puma", "Louis Vuitton", "Vans", "Salomon", "Reebok"];

export function BrandMarquee() {
  const items = BRANDS.map((b, i) => (
    <span key={b + i} className="flex items-center gap-6 px-6 sm:gap-10 sm:px-10">
      <span 
        className={`text-[28px] sm:text-[42px] lg:text-[56px] font-black uppercase tracking-tighter whitespace-nowrap ${
          i % 2 === 0 ? 'text-white' : 'text-transparent'
        }`}
        style={{
          WebkitTextStroke: i % 2 !== 0 ? '1.5px rgba(255,255,255,0.8)' : 'none',
        }}
      >
        {b}
      </span>
      <span className="mx-2 h-1.5 w-1.5 rotate-45 bg-white/40 sm:mx-4 sm:h-2 sm:w-2" />
    </span>
  ));

  return (
    <div className="relative mt-12 sm:mt-24 h-[120px] sm:h-[180px] w-full overflow-hidden flex items-center justify-center">
      <div 
        className="glass-deep absolute w-[110vw] py-3 sm:py-5 -rotate-2"
      >
        <div className="marquee-track flex w-max items-center">
          {items}{items}{items}
        </div>
      </div>
    </div>
  );
}
