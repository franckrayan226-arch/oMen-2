import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useProducts, ProductItem } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/format";

const CATEGORIES = [
  "Tous",
  "Smartphones",
  "Ordinateurs",
  "Audio",
  "Tablettes",
  "Accessoires",
  "Montres",
];

function ProductCard({ p }: { p: ProductItem }) {
  return (
    <Link to={`/produit/${p.slug}`} className="group block">
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
        {p.compareAt && p.compareAt > p.price && (
          <span className="absolute left-3 top-3 bg-[#111] px-2.5 py-1 text-[11px] font-medium text-white">
            -{Math.round(((p.compareAt - p.price) / p.compareAt) * 100)}%
          </span>
        )}
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[12px] text-[#999]">{p.category}</p>
          <p className="mt-0.5 truncate text-[14px] text-[#111]">{p.name}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[14px] font-medium">{formatPrice(p.price)}</p>
          {p.compareAt && p.compareAt > p.price && (
            <p className="text-[12px] text-[#999] line-through">{formatPrice(p.compareAt)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Catalogue() {
  const { products, loading } = useProducts();
  const [cat, setCat] = useState("Tous");

  const filtered = useMemo(() => {
    if (cat === "Tous") return products;
    return products.filter((p) => p.category === cat);
  }, [products, cat]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">Boutique</p>
          <h1 className="mt-3 text-[36px] font-light leading-tight tracking-tight lg:text-[48px]">
            Tout le catalogue
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[#e5e5e5] pb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-[13px] transition-colors duration-200 ${
                  cat === c
                    ? "font-medium text-[#111]"
                    : "text-[#999] hover:text-[#555]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton aspect-[3/4] w-full" />
                  <div className="mt-3 space-y-2">
                    <div className="skeleton h-3.5 w-3/4" />
                    <div className="skeleton h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length ? (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="mt-20 text-center">
              <p className="text-[14px] text-[#999]">Aucun produit dans cette catégorie.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
