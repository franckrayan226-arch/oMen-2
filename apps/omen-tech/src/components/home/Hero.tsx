import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbfbfd] to-white">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="animate-fade-in text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0071e3]">
          Nouveautés
        </p>
        <h1 className="animate-fade-in mx-auto mt-4 max-w-3xl text-[36px] font-bold leading-[1.05] tracking-tight text-[#1d1d1f] sm:text-[56px] lg:text-[72px]">
          La technologie,
          <br />
          <span className="text-[#86868b]">redéfinie.</span>
        </h1>
        <p className="animate-fade-in mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
          Smartphones, laptops, audio et accessoires. Les dernières innovations des plus grandes marques.
        </p>
        <div className="animate-fade-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/catalogue"
            className="inline-flex h-11 items-center rounded-btn bg-[#0071e3] px-7 text-[14px] font-medium text-white transition-all duration-200 hover:bg-[#0058b0] active:scale-[0.98]"
          >
            Découvrir
          </Link>
          <Link
            to="/catalogue"
            className="inline-flex h-11 items-center rounded-btn border border-[#d2d2d7] px-7 text-[14px] font-medium text-[#0071e3] transition-all duration-200 hover:border-[#0071e3] active:scale-[0.98]"
          >
            Voir tout
          </Link>
        </div>
      </div>

      <div className="absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[#0071e3]/[0.04] blur-3xl" />
    </section>
  );
}
