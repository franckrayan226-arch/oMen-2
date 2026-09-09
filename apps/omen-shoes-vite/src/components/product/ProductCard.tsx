import { useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAt?: number;
  colors?: number;
  badge?: "Nouveau" | "Promo" | "Top";
  image?: string;
}

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Viewfinder corner mark — white + mix-blend-difference stays visible on any photo. */
function Corner({ pos, border }: { pos: string; border: React.CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-4 w-4 opacity-0 transition-all duration-500 group-hover:opacity-100 ${pos}`}
      style={{
        ...border,
        mixBlendMode: "difference",
        transitionTimingFunction: SPRING,
      }}
    />
  );
}

export function ProductCard({ id, slug, name, brand, price, compareAt, colors, badge, image }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const favorites = useFavorites((s) => s.items);
  const addFavorite = useFavorites((s) => s.addItem);
  const removeFavorite = useFavorites((s) => s.removeItem);
  const isFav = favorites.some((f) => f.productId === id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(id);
    } else {
      addFavorite({ productId: id, slug, name, brand, price, image: image ?? "" });
    }
  };

  const discount = compareAt ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  return (
    <Link
      to={`/produit/${slug}`}
      className="glass group block rounded-[22px] p-2.5 outline-none transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(17,24,39,0.28)] focus-visible:ring-2 focus-visible:ring-[#1d4ed8]/30 active:scale-[0.985]"
      style={{ transitionTimingFunction: SPRING }}
      aria-label={`${brand} ${name}, ${price.toLocaleString("fr-FR")} FCFA`}
    >
      {/* ── Photo zone ── */}
      <div className="relative">
        {/* studio frame, inset like a mounted print */}
        <div
          className="relative aspect-square overflow-hidden rounded-[15px] bg-[#f1f2f4]"
          style={{ boxShadow: "inset 0 0 0 1px rgba(17,24,39,0.06)" }}
        >
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          {image ? (
            <img
              src={image}
              alt={`${brand} ${name}`}
              className={`h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.045] ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              style={{ transitionTimingFunction: EASE }}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="h-[70%] w-[70%] rounded-xl bg-[#e3e5e9]" />
            </div>
          )}

          {/* studio light: top gloss, soft vignette, floor shadow */}
          <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 20%)" }} />
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 35%, transparent 58%, rgba(10,12,16,0.08) 100%)" }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,12,16,0.09) 90%)" }} />

          {/* focus-lock: viewfinder brackets draw in on hover */}
          <Corner pos="left-2.5 top-2.5" border={{ borderLeft: "1.5px solid rgba(255,255,255,0.9)", borderTop: "1.5px solid rgba(255,255,255,0.9)" }} />
          <Corner pos="right-2.5 top-2.5" border={{ borderRight: "1.5px solid rgba(255,255,255,0.9)", borderTop: "1.5px solid rgba(255,255,255,0.9)" }} />
          <Corner pos="bottom-2.5 left-2.5" border={{ borderLeft: "1.5px solid rgba(255,255,255,0.9)", borderBottom: "1.5px solid rgba(255,255,255,0.9)" }} />
          <Corner pos="bottom-2.5 right-2.5" border={{ borderRight: "1.5px solid rgba(255,255,255,0.9)", borderBottom: "1.5px solid rgba(255,255,255,0.9)" }} />

          {/* heart — top left */}
          <button
            onClick={toggleFavorite}
            className={`glass-chip absolute left-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-90 ${isFav ? "badge-animate" : ""}`}
            style={{ transitionTimingFunction: SPRING }}
            aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-pressed={isFav}
          >
            <svg
              className={`h-[15px] w-[15px] transition-colors duration-300 ${isFav ? "fill-[#1d4ed8] text-[#1d4ed8]" : "fill-none text-[#111]"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* badge — top right, quiet frosted ink (no gradient glow) */}
          {badge && (
            <span className="glass-chip absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#111]/85 sm:text-[9.5px]">
              {badge}
            </span>
          )}

          {/* promo chip — bottom right */}
          {discount > 0 && (
            <span className="glass-chip absolute bottom-2.5 right-2.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-tight text-[#1e4fc2]">
              -{discount}%
            </span>
          )}
        </div>

        {/* price — ink glass capsule straddling the frame's bottom edge */}
        <span
          className="absolute -bottom-3 left-3.5 z-10 inline-flex items-baseline gap-1 rounded-full px-3.5 py-1.5 text-[11.5px] font-extrabold tracking-tight text-white transition-transform duration-300 group-hover:scale-[1.05]"
          style={{
            background: "rgba(15,17,21,0.84)",
            backdropFilter: "blur(14px) saturate(1.4)",
            WebkitBackdropFilter: "blur(14px) saturate(1.4)",
            boxShadow: "0 12px 26px -12px rgba(15,17,21,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
            transitionTimingFunction: SPRING,
          }}
        >
          {price.toLocaleString("fr-FR")}
          <span className="text-[8.5px] font-bold text-white/55">FCFA</span>
        </span>
      </div>

      {/* ── Info zone ── */}
      <div className="px-2 pb-2 pt-6">
        <div className="flex items-center justify-between gap-2">
          {/* brand: precise blue micro-dot + muted caps — blue as an accent, not a shout */}
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1 w-1 shrink-0 rounded-full bg-[#1d4ed8]" aria-hidden="true" />
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#111]/55 sm:text-[9.5px]">{brand}</span>
          </span>
          {colors && colors > 1 && (
            <span className="shrink-0 text-[9px] font-medium tracking-wide text-[#111]/40">{colors} col.</span>
          )}
        </div>

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.6em] text-[13px] font-semibold leading-snug tracking-[-0.01em] text-[#111] sm:text-[13.5px]">{name}</h3>

        {/* editorial hairline, then the service row */}
        <div className="mt-2 flex items-center justify-between border-t border-[#111]/[0.07] pt-2.5">
          {compareAt ? (
            <span className="text-[10px] font-medium text-[#111]/40 line-through">{compareAt.toLocaleString("fr-FR")} F</span>
          ) : (
            <span className="text-[9.5px] font-medium tracking-wide text-[#111]/40">Livraison 24h · Lomé & Ouaga</span>
          )}

          <span
            className="flex h-6 w-6 shrink-0 translate-x-1 items-center justify-center rounded-full bg-[#111] text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            style={{ transitionTimingFunction: SPRING }}
            aria-hidden="true"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
