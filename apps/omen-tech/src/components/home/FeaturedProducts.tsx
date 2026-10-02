import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/format";
import { useFavorites } from "@/hooks/useFavorites";

const OFFSETS = ["lg:mt-0", "lg:mt-12", "lg:mt-6", "lg:mt-16", "lg:mt-2", "lg:mt-10"];

export function FeaturedProducts() {
  const { products, loading } = useProducts();
  const toggle = useFavorites((s) => s.toggle);
  const isFavorite = useFavorites((s) => s.isFavorite);
  const featured = products.slice(0, 6);

  if (!loading && featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-24">
      <div className="flex items-end justify-between border-b border-[#e5e5e5] pb-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">Sélection</p>
          <h2 className="mt-2 text-[28px] font-light tracking-tight lg:text-[34px]">À regarder</h2>
        </div>
        <Link
          to="/catalogue"
          className="text-[13px] font-medium text-[#555] underline underline-offset-4 transition-colors hover:text-[#111]"
        >
          Tout voir
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={OFFSETS[i % OFFSETS.length]}>
                <div className="skeleton aspect-[3/4] w-full" />
                <div className="mt-3 space-y-2">
                  <div className="skeleton h-3.5 w-3/4" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              </div>
            ))
          : featured.map((p, i) => (
              <div key={p.id} className={`group ${OFFSETS[i % OFFSETS.length]}`}>
                <Link to={`/produit/${p.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[12px] text-[#999]">
                        Pas d&rsquo;image
                      </div>
                    )}
                    <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggle({
                            productId: p.id,
                            slug: p.slug,
                            name: p.name,
                            brand: p.brand,
                            price: p.price,
                            image: p.image,
                          });
                        }}
                        className={`flex h-8 w-8 items-center justify-center text-[13px] backdrop-blur-sm transition-colors ${
                          isFavorite(p.id)
                            ? "bg-[#111] text-white"
                            : "bg-white/90 text-[#111] hover:bg-white"
                        }`}
                        aria-label="Enregistrer"
                      >
                        {isFavorite(p.id) ? "✓" : "+"}
                      </button>
                    </div>
                  </div>
                </Link>
                <div className="mt-3.5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/produit/${p.slug}`}
                      className="block truncate text-[14px] font-normal text-[#111] hover:underline"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-0.5 truncate text-[12px] text-[#999]">{p.brand}</p>
                  </div>
                  <p className="shrink-0 text-[14px] font-medium">{formatPrice(p.price)}</p>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
