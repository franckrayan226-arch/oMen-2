import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    title: "Marche\nau-dessus.",
    subtitle: "SNEAKERS · LOMÉ",
    cta: "Voir les paires",
    to: "/catalogue",
    image: "/shoes/widget-1.jpg",
  },
  {
    title: "Style\nsans limite.",
    subtitle: "NIKE · COLLECTION",
    cta: "Découvrir",
    to: "/catalogue?marque=Nike",
    image: "/shoes/widget-2.jpg",
  },
  {
    title: "Icône\nde la rue.",
    subtitle: "JORDAN · RÉTRO",
    cta: "Voir les paires",
    to: "/catalogue?marque=Jordan",
    image: "/shoes/widget-3.jpg",
  },
  {
    title: "Élégance\nsportive.",
    subtitle: "ADIDAS · ORIGINALS",
    cta: "Explorer",
    to: "/catalogue?marque=adidas",
    image: "/shoes/widget-4.jpg",
  },
  {
    title: "Confort\nréinventé.",
    subtitle: "NEW BALANCE · 550",
    cta: "Découvrir",
    to: "/catalogue?marque=New+Balance",
    image: "/shoes/widget-5.jpg",
  },
  {
    title: "Rue\ndu monde.",
    subtitle: "PUMA · CLASSIC",
    cta: "Voir les paires",
    to: "/catalogue?marque=Puma",
    image: "/shoes/widget-6.jpg",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const next = useCallback(() => setActive((p) => (p + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { next(); return 0; }
        return p + 5;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [next, paused, active]);

  const goTo = (i: number) => {
    if (i === active) return;
    setProgress(0);
    setActive(i);
  };

  const slide = SLIDES[active];

  return (
    <section
      className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-2xl"
      style={{ background: "#111" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[420px]">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: i === active ? 1 : 0,
              transition: "opacity 0.5s ease",
              pointerEvents: i === active ? "auto" : "none",
            }}
          >
            <img src={s.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-16 sm:justify-center sm:p-10 lg:p-16">
          <div className="max-w-lg" key={active}>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/60 sm:text-[12px]"
              style={{ animation: "hero-text 0.35s ease-out both" }}
            >
              {slide.subtitle}
            </p>
            <h1
              className="mt-2 text-[42px] leading-[0.9] text-white sm:text-[60px] lg:text-[72px] whitespace-pre-line"
              style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontWeight: 700, animation: "hero-text 0.35s ease-out 0.04s both" }}
            >
              {slide.title}
            </h1>
            <div style={{ animation: "hero-text 0.35s ease-out 0.08s both" }}>
              <Link
                to={slide.to}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-[13px] font-medium text-white transition-all hover:bg-white/20 sm:mt-8"
              >
                {slide.cta}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-6 flex items-center gap-2 sm:left-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-[3px] overflow-hidden rounded-full transition-all duration-300"
            style={{ width: i === active ? 32 : 12, background: i === active ? "transparent" : "rgba(255,255,255,0.3)" }}
            aria-label={`Slide ${i + 1}`}
          >
            {i === active && (
              <div
                className="h-full rounded-full bg-white"
                style={{
                  transformOrigin: "left",
                  transform: `scaleX(${progress / 100})`,
                  transition: paused ? "none" : undefined,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}