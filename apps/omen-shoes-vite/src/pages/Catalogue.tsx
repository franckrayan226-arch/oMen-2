import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const MARQUES = ["Nike", "Jordan", "adidas", "New Balance", "Puma", "Louis Vuitton", "Vans"];
const SORT_OPTIONS = [
  { value: "recent", label: "Plus récent" },
  { value: "price-asc", label: "Prix ↑" },
  { value: "price-desc", label: "Prix ↓" },
];

// Fallback static products if API returns nothing
const FALLBACK_PRODUCTS: Array<{ id: string; slug: string; name: string; brand: string; price: number; compareAt?: number; colorsCount: number; badge?: "Nouveau" | "Promo" | "Top"; image: string }> = [
  { id: "1", slug: "nike-air-max-90", name: "Nike Air Max 90", brand: "Nike", price: 45000, compareAt: 55000, colorsCount: 3, badge: "Nouveau", image: "/shoes/nike-air-max-90.jpg" },
  { id: "2", slug: "jordan-1-retro-high", name: "Jordan 1 Retro High OG", brand: "Jordan", price: 75000, colorsCount: 2, badge: "Top", image: "/shoes/jordan-1.jpg" },
  { id: "3", slug: "new-balance-550", name: "New Balance 550", brand: "New Balance", price: 38000, colorsCount: 4, image: "/shoes/new-balance-550.jpg" },
  { id: "4", slug: "adidas-samba-og", name: "adidas Samba OG", brand: "adidas", price: 42000, colorsCount: 2, badge: "Nouveau", image: "/shoes/adidas-samba-og.jpg" },
  { id: "5", slug: "nike-dunk-low", name: "Nike Dunk Low Retro", brand: "Nike", price: 48000, colorsCount: 5, image: "/shoes/nike-dunk-low.jpg" },
  { id: "6", slug: "jordan-4-retro", name: "Jordan 4 Retro", brand: "Jordan", price: 85000, compareAt: 95000, colorsCount: 2, badge: "Promo", image: "/shoes/jordan-4-retro.jpg" },
  { id: "7", slug: "puma-suede-classic", name: "Puma Suede Classic", brand: "Puma", price: 32000, colorsCount: 3, image: "/shoes/puma-suede-classic.jpg" },
  { id: "8", slug: "lv-trainer", name: "Louis Vuitton LV Trainer", brand: "Louis Vuitton", price: 120000, colorsCount: 2, badge: "Top", image: "/shoes/lv-trainer.jpg" },
  { id: "9", slug: "nike-air-force-1", name: "Nike Air Force 1 '07", brand: "Nike", price: 40000, colorsCount: 4, image: "/shoes/nike-air-force-1-og.jpg" },
  { id: "10", slug: "adidas-stan-smith", name: "adidas Stan Smith", brand: "adidas", price: 35000, colorsCount: 3, image: "/shoes/adidas-stan.jpg" },
  { id: "11", slug: "new-balance-2002r", name: "New Balance 2002R", brand: "New Balance", price: 52000, colorsCount: 2, badge: "Nouveau", image: "/shoes/nb-2002r.jpg" },
  { id: "12", slug: "vans-old-skool", name: "Vans Old Skool", brand: "Vans", price: 25000, colorsCount: 3, image: "/shoes/vans.jpg" },
];

export default function Catalogue() {
  const [params] = useSearchParams();
  const marque = params.get("marque");
  const promo = params.get("promo");
  const [brand, setBrand] = useState<string>(marque || "");
  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");
  const { products: apiProducts, loading } = useProducts();

  const ALL_PRODUCTS = loading ? []     : apiProducts.length > 0
      ? apiProducts.map(p => ({ ...p, colors: p.colorsCount, compareAt: p.compareAt ?? undefined, badge: (p.badge as any) || undefined })) : FALLBACK_PRODUCTS;

  let filtered = ALL_PRODUCTS.filter((p) => {
    if (brand && p.brand !== brand) return false;
    if (promo && !p.compareAt) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-24 sm:pb-0">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8] sm:text-[11px]">Toutes les paires</p>
          <h1 className="mt-1 text-[22px] text-[#111] sm:text-[32px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Catalogue</h1>

          <div className="mt-3 sm:hidden">
            <div className="relative">
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="input w-full rounded-lg px-3 py-2.5 pr-8 text-[13px]" />
              <svg className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-4">
            <button onClick={() => setBrand("")} className={`rounded-lg px-3 py-1.5 text-[11px] font-medium ${brand === "" ? "btn-primary" : "btn-secondary"}`}>Tout</button>
            {MARQUES.map((b) => (
              <button key={b} onClick={() => setBrand(b)} className={`rounded-lg px-3 py-1.5 text-[11px] font-medium ${brand === b ? "btn-primary" : "btn-secondary"}`}>{b}</button>
            ))}
            <div className="ml-auto flex items-center gap-1.5">
              <div className="hidden sm:block relative">
                <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="input h-8 w-36 rounded-lg px-3 pr-8 text-[12px] transition-all focus:w-48" />
                <svg className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input h-8 rounded-lg px-2 text-[11px]">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#1d4ed8] border-t-transparent" />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-4">
              {filtered.map((product, i) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-[13px] text-[#666]">Aucune paire trouvée</p>
              <button onClick={() => { setBrand(""); setSearch(""); }} className="btn-secondary mt-2 rounded-lg px-4 py-2 text-[12px] font-medium">Réinitialiser</button>
            </div>
          )}

          <p className="mt-4 text-center text-[11px] text-[#999]">{filtered.length} {filtered.length === 1 ? "résultat" : "résultats"}</p>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}