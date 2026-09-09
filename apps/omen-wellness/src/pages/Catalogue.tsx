import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

const SORT_OPTIONS = [
  { value: "recent", label: "Populaire" },
  { value: "price-asc", label: "Prix ↑" },
  { value: "price-desc", label: "Prix ↓" },
];

export default function Catalogue() {
  const [params] = useSearchParams();
  const cat = params.get("cat");
  const [category, setCategory] = useState<string>(cat || "");
  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");
  const { products: apiProducts, loading } = useProducts();

  // Merge API products with static fallback
  const allProducts = apiProducts.length > 0
    ? [...apiProducts.map(p => ({
        ...p,
        brand: p.brand || "Omen Lab",
        description: "",
        ritual: [] as string[],
        actives: "",
        variants: [] as any[],
      })), ...PRODUCTS.filter(sp => !apiProducts.some(ap => ap.slug === sp.slug))]
    : PRODUCTS;

  let filtered = allProducts.filter((p) => {
    if (category && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-28 sm:pb-0">
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10">
          <p className="label-mono px-1 text-[9px] text-[#b4552d] sm:text-[10px]">Formules & préparations</p>
          <h1 className="font-display mt-2 px-1 text-[28px] text-[#17211a] sm:text-[40px]">Catalogue</h1>

          <div className="glass-soft mt-5 rounded-3xl p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <button onClick={() => setCategory("")} className={`rounded-full px-4 py-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] transition-all active:scale-[0.97] ${category === "" ? "btn-ink" : "btn-glass"}`}>Tout</button>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-4 py-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] transition-all active:scale-[0.97] ${category === c ? "btn-ink" : "btn-glass"}`}>{c}</button>
              ))}
              <div className="ml-auto flex items-center gap-1.5">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="glass-input h-9 rounded-full px-3 text-[10px] uppercase tracking-[0.1em]">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="relative mt-2">
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="RECHERCHER" className="glass-input h-10 w-full rounded-full px-4 pr-9 text-[11px] uppercase tracking-[0.12em]" />
              <svg className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#17211a]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#b4552d] border-t-transparent" />
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-4 lg:grid-cols-4">
              {filtered.map((product, i) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="glass mt-5 rounded-3xl py-16 text-center">
              <p className="text-[12px] text-[#17211a]/60">Aucune préparation trouvée</p>
              <button onClick={() => { setCategory(""); setSearch(""); }} className="btn-glass mt-3 rounded-full px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em]">Réinitialiser</button>
            </div>
          )}

          <p className="mt-5 px-1 text-[9.5px] uppercase tracking-[0.2em] text-[#17211a]/45">{filtered.length} {filtered.length === 1 ? "préparation" : "préparations"}</p>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}