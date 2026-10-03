import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { useProducts, ProductItem } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { formatPrice } from "@/lib/format";

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
          <p className="truncate text-[12px] text-[#999]">{p.brand || p.category}</p>
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

function brandPillClass(active: boolean) {
  return `rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-200 ${
    active
      ? "border-[#111] bg-[#111] text-white"
      : "border-[#e5e5e5] bg-white text-[#555] hover:border-[#999] hover:text-[#111]"
  }`;
}

export default function Catalogue() {
  const { products, loading } = useProducts();
  const { categories: catList } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const paramCat = searchParams.get("cat") || "";
  const paramMarque = searchParams.get("marque") || "";

  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category).filter(Boolean));
    // Ordre = ordre du dashboard (sortOrder), puis catégories hors dashboard
    const orderedFromApi = catList.map((c) => c.name).filter((n) => present.has(n));
    const extras = Array.from(present)
      .filter((n) => !orderedFromApi.includes(n))
      .sort((a, b) => a.localeCompare(b));
    const ordered = [...orderedFromApi, ...extras];
    if (paramCat && !ordered.includes(paramCat)) ordered.push(paramCat);
    return ordered;
  }, [products, catList, paramCat]);

  const cat = paramCat && categories.includes(paramCat) ? paramCat : "Tous";

  const inCat = useMemo(
    () => (cat === "Tous" ? products : products.filter((p) => p.category === cat)),
    [products, cat]
  );

  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    inCat.forEach((p) => {
      const b = (p.brand || "").trim();
      if (b) counts.set(b, (counts.get(b) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [inCat]);

  const activeBrand =
    brands.find((b) => b.name.toLowerCase() === paramMarque.toLowerCase())?.name || "";

  const filtered = useMemo(
    () =>
      activeBrand
        ? inCat.filter((p) => (p.brand || "").trim().toLowerCase() === activeBrand.toLowerCase())
        : inCat,
    [inCat, activeBrand]
  );

  const selectCat = (c: string) => {
    const next = new URLSearchParams();
    if (c !== "Tous") next.set("cat", c);
    setSearchParams(next);
  };

  const selectBrand = (b: string) => {
    const next = new URLSearchParams();
    if (cat !== "Tous") next.set("cat", cat);
    if (b) next.set("marque", b);
    setSearchParams(next);
  };

  const resetAll = () => setSearchParams(new URLSearchParams());

  const tabs = ["Tous", ...categories.filter((c) => c !== "Tous")];

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999]">Boutique</p>
          <h1 className="mt-3 text-[34px] font-bold uppercase leading-tight tracking-[-0.02em] lg:text-[46px]">
            Tout le catalogue
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[#e5e5e5] pb-4">
            {tabs.map((c) => (
              <button
                key={c}
                onClick={() => selectCat(c)}
                className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                  cat === c
                    ? "font-medium text-[#111]"
                    : "text-[#999] hover:text-[#555]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {!loading && brands.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#999]">
                Marque
              </span>
              <button
                onClick={() => selectBrand("")}
                className={brandPillClass(!activeBrand)}
              >
                Toutes
              </button>
              {brands.map((b) => {
                const active = activeBrand === b.name;
                return (
                  <button
                    key={b.name}
                    onClick={() => selectBrand(active ? "" : b.name)}
                    className={brandPillClass(active)}
                  >
                    {b.name}{" "}
                    <span className={active ? "text-white/50" : "text-[#bbb]"}>({b.count})</span>
                  </button>
                );
              })}
            </div>
          )}

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
              <p className="text-[14px] text-[#999]">
                {activeBrand
                  ? `Aucun produit pour la marque ${activeBrand}.`
                  : cat !== "Tous"
                    ? "Aucun produit dans cette catégorie."
                    : "Aucun produit disponible pour le moment."}
              </p>
              {(activeBrand || cat !== "Tous") && (
                <button
                  onClick={resetAll}
                  className="mt-5 rounded-full border border-[#111] bg-[#111] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1d4ed8] hover:border-[#1d4ed8]"
                >
                  Voir tout le catalogue
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
