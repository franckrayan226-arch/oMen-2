import { Link } from "react-router-dom";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

export function BestSellers() {
  const { products: apiProducts } = useProducts();

  // Use API products if available, fallback to static
  const items = apiProducts.length > 0
    ? apiProducts.slice(0, 4).map(p => ({
        ...p,
        brand: p.brand || "Omen Lab",
        category: p.category || "",
        description: "",
        ritual: [] as string[],
        actives: "",
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
        {items.map((product, i) => (
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