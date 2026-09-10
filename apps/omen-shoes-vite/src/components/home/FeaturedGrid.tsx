import { ProductCard } from "@/components/product/ProductCard";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

const FALLBACK = [
  { id: "1", slug: "nike-air-max-90", name: "Nike Air Max 90", brand: "Nike", price: 45000, compareAt: 55000, colors: 3, badge: "Nouveau" as const, image: "/shoes/nike-air-max-90.jpg" },
  { id: "2", slug: "jordan-1-retro-high", name: "Jordan 1 Retro High OG", brand: "Jordan", price: 75000, colors: 2, badge: "Top" as const, image: "/shoes/jordan-1.jpg" },
  { id: "3", slug: "new-balance-550", name: "New Balance 550", brand: "New Balance", price: 38000, colors: 4, image: "/shoes/new-balance-550.jpg" },
  { id: "4", slug: "adidas-samba-og", name: "adidas Samba OG", brand: "adidas", price: 42000, colors: 2, badge: "Nouveau" as const, image: "/shoes/adidas-samba-og.jpg" },
  { id: "5", slug: "nike-dunk-low", name: "Nike Dunk Low Retro", brand: "Nike", price: 48000, colors: 5, image: "/shoes/nike-dunk-low.jpg" },
  { id: "6", slug: "jordan-4-retro", name: "Jordan 4 Retro", brand: "Jordan", price: 85000, compareAt: 95000, badge: "Promo" as const, image: "/shoes/jordan-4-retro.jpg" },
  { id: "7", slug: "puma-suede-classic", name: "Puma Suede Classic", brand: "Puma", price: 32000, colors: 3, image: "/shoes/puma-suede-classic.jpg" },
  { id: "8", slug: "lv-trainer", name: "Louis Vuitton LV Trainer", brand: "Louis Vuitton", price: 120000, colors: 2, badge: "Top" as const, image: "/shoes/lv-trainer.jpg" },
];

export function FeaturedGrid() {
  const { products: apiProducts, loading } = useProducts();
  const products = loading
    ? []
    : apiProducts.length > 0
      ? apiProducts.slice(0, 8).map(p => ({ ...p, colors: p.colorsCount, compareAt: p.compareAt ?? undefined, badge: (p.badge as any) || undefined }))
      : FALLBACK;

  return (
    <section className="mx-auto mt-8 max-w-7xl px-3 sm:px-6 sm:mt-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8] sm:text-[11px]">Sélection</p>
          <h2 className="mt-1 text-[22px] text-[#111] sm:text-[28px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Nouveautés</h2>
        </div>
        <Link to="/catalogue" className="text-[12px] font-semibold text-[#1d4ed8] hidden sm:block hover:underline">Tout voir →</Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-xl bg-gray-200" />
              <div className="mt-2 h-3 w-3/4 rounded bg-gray-200" />
              <div className="mt-1 h-2 w-1/2 rounded bg-gray-200" />
            </div>
          ))
        ) : products.map((product, i) => (
          <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      <div className="mt-5 text-center sm:hidden">
        <Link to="/catalogue" className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-[12px] font-semibold">
          Tout voir
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </section>
  );
}