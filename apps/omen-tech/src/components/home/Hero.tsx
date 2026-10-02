import { Link } from "react-router-dom";

const HERO_IMAGE =
  "https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_1920/v1790966248/omen-tech/wouuzz9vbppywbgiioyh.jpg";

export function Hero() {
  return (
    <section className="relative h-[75vh] min-h-[540px] max-h-[820px] w-full overflow-hidden bg-black">
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-12 lg:px-10 lg:pb-16">
        <p className="fade-up font-mono text-[11px] uppercase tracking-[0.28em] text-white/60">
          Togo &amp; Burkina Faso — Livraison 24-48h
        </p>

        <h1 className="fade-up fade-up-1 mt-4 text-[52px] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-white sm:text-[72px] lg:text-[96px]">
          La tech
          <br />
          sans d&eacute;tour.
        </h1>

        <p className="fade-up fade-up-2 mt-5 max-w-[440px] text-[15px] leading-relaxed text-white/70">
          Smartphones, ordinateurs, audio et accessoires — payés à la livraison,
          chez vous.
        </p>

        <div className="fade-up fade-up-3 mt-8">
          <Link
            to="/catalogue"
            className="group inline-flex items-center gap-3 bg-white px-7 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-[#111] transition-colors hover:bg-[#1d4ed8] hover:text-white"
          >
            Voir la boutique
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
