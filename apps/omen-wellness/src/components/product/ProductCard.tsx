import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAt?: number;
  badge?: "Nouveau" | "Promo" | "Best-seller";
  image: string;
}

const BADGE_CLASS: Record<string, string> = {
  "Nouveau": "tag-glass tag-glass-dark",
  "Promo": "tag-glass tag-glass-terra",
  "Best-seller": "tag-glass",
};

export function ProductCard({ slug, name, category, price, compareAt, badge, image }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link to={`/produit/${slug}`} className="glass group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#17211a]/15">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#ece4d2]">
        {!imageLoaded && <div className="absolute inset-0 skeleton" />}
        {image ? (
          <img
            src={image}
            alt={name}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[55%] w-[45%] rounded-lg bg-[#d8cdb4]" />
          </div>
        )}

        {badge && <span className={`absolute left-3 top-3 ${BADGE_CLASS[badge]}`}>{badge}</span>}

        <span className="glass-soft absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-[11px] font-bold text-[#17211a]">
          {price.toLocaleString("fr-FR")} F
        </span>
      </div>

      <div className="px-3.5 pb-4 pt-3">
        <span className="label-mono text-[8px] text-[#17211a]/55">{category}</span>
        <h3 className="font-display mt-1 text-[14.5px] leading-tight text-[#17211a] sm:text-[15.5px]">{name}</h3>
        {compareAt && (
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[10px] text-[#17211a]/45 line-through">{compareAt.toLocaleString("fr-FR")}</span>
            <span className="text-[9px] font-bold text-[#b4552d]">-{Math.round(((compareAt - price) / compareAt) * 100)}%</span>
          </div>
        )}
      </div>
    </Link>
  );
}
