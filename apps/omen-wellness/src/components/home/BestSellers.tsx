import { Link } from "react-router-dom";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

export function BestSellers() {
  const { products: apiProducts, loading } = useProducts();

  // Use API products if available, fallback to static only when not loading
  const items = loading
    ? []
    : apiProducts.length > 0
      ? apiProducts.slice(0, 4).map(p => ({
          ...p,
          brand: p.brand || "Omen Lab",
          category: p.category || "",
          description: "",
          ritual: [] as string[],
          actives: "",
          compareAt: p.compareAt ?? undefined,
          badge: (p.badge as any) || undefined,
          variants: [] as any[],
        }))
      : PRODUCTS.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-16">
      <div className="flex items-end justify-between">
        <div>
          <p className="label-mono text-[9px] text-[#b4552d] sm:text-[10px]">En préparation</p>
          <h2 className="font-display mt-2 text-[24px] text-[#17211a] sm:text-[32px]">Les essentiels</h2>
        </div>
        <Link to="/catalogue" className="btn-glass hidden rounded-full px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] sm:block">
          Catalogue complet →
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-3xl bg-[#17211a]/5" />
              <div className="mt-2 h-3 w-3/4 rounded bg-[#17211a]/5" />
              <div className="mt-1 h-2 w-1/2 rounded bg-[#17211a]/5" />
            </div>
          ))
        ) : items.map((product, i) => (
          <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link to="/catalogue" className="btn-glass inline-block rounded-full px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em]">
          Catalogue complet
        </Link>
      </div>
    </section>
  );
}