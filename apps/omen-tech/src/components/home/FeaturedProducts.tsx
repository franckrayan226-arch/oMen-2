import { Link } from "react-router-dom";
import { useProducts, ProductItem } from "@/hooks/useProducts";

function ProductCard({ p }: { p: ProductItem }) {
  const discount = p.compareAt && p.compareAt > p.price
    ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100)
    : null;

  return (
    <Link
      to={`/produit/${p.slug}`}
      className="group block rounded-card bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-card bg-[#f5f5f7]">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d2d2d7" strokeWidth="1">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
        )}
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-[#ff3b30] px-2.5 py-0.5 text-[11px] font-semibold text-white">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#86868b]">{p.category}</p>
        <h3 className="mt-1 text-[14px] font-semibold leading-snug text-[#1d1d1f] line-clamp-2">{p.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-[#1d1d1f]">
            {p.price.toLocaleString("fr-FR")} FCFA
          </span>
          {p.compareAt && p.compareAt > p.price && (
            <span className="text-[13px] text-[#86868b] line-through">
              {p.compareAt.toLocaleString("fr-FR")} FCFA
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-card bg-white shadow-card">
      <div className="skeleton aspect-square rounded-t-card" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 8);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-[24px] font-bold tracking-tight text-[#1d1d1f] sm:text-[32px]">À la une</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (!featured.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex items-end justify-between">
        <h2 className="text-[24px] font-bold tracking-tight text-[#1d1d1f] sm:text-[32px]">À la une</h2>
        <Link to="/catalogue" className="text-[13px] font-medium text-[#0071e3] hover:underline">
          Tout voir →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {featured.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
