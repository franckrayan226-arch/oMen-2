import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProduct(slug || "");
  const addItem = useCart((s) => s.addItem);
  const { items: favs, addItem: addFav, removeItem: removeFav } = useFavorites();
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="skeleton aspect-square rounded-card" />
            <div className="space-y-4">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-6 w-32 rounded" />
              <div className="skeleton h-24 w-full rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-[14px] text-[#6e6e73]">Produit introuvable.</p>
            <Link to="/catalogue" className="mt-4 inline-block text-[13px] font-medium text-[#0071e3] hover:underline">
              ← Retour au catalogue
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images: string[] = [
    ...(product.images?.map((i: any) => i.url) || []),
    ...(product.colors?.flatMap((c: any) => c.images?.map((i: any) => i.url) || []) || []),
  ].filter(Boolean);
  const mainImage = images[selectedImage] || images[0] || "";
  const isFav = favs.some((f) => f.productId === product.id);
  const variants = product.variants || [];
  const sizes: string[] = [...new Set(variants.map((v: any) => v.size).filter(Boolean))] as string[];

  const handleAdd = (size: string) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand || product.category || "",
      price: product.price,
      image: mainImage,
      size,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleFav = () => {
    if (isFav) removeFav(product.id);
    else addFav({ productId: product.id, slug: product.slug, name: product.name, brand: product.brand || "", price: product.price, image: mainImage });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <Link to="/catalogue" className="text-[13px] text-[#6e6e73] transition-colors hover:text-[#0071e3]">
            ← Produits
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square overflow-hidden rounded-card bg-[#f5f5f7]">
                {mainImage ? (
                  <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d2d2d7" strokeWidth="1">
                      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === i ? "border-[#0071e3]" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="flex flex-col">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0071e3]">{product.category}</p>
              <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-[#1d1d1f] sm:text-[36px]">{product.name}</h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-[24px] font-bold text-[#1d1d1f]">{product.price?.toLocaleString("fr-FR")} FCFA</span>
                {product.compareAt && product.compareAt > product.price && (
                  <span className="text-[16px] text-[#86868b] line-through">{product.compareAt.toLocaleString("fr-FR")} FCFA</span>
                )}
              </div>

              {product.description && (
                <p className="mt-4 text-[14px] leading-relaxed text-[#6e6e73]">{product.description}</p>
              )}

              {/* Tailles */}
              {sizes.length > 0 && (
                <div className="mt-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#86868b]">Options</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizes.map((s: string) => (
                      <button
                        key={s}
                        onClick={() => handleAdd(s)}
                        className="rounded-full border border-[#d2d2d7] px-4 py-2 text-[13px] font-medium text-[#1d1d1f] transition-all hover:border-[#0071e3] hover:text-[#0071e3]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => handleAdd(sizes[0] || "")}
                  className={`flex-1 h-12 rounded-btn text-[14px] font-medium transition-all duration-200 active:scale-[0.98] ${
                    added
                      ? "bg-[#34c759] text-white"
                      : "bg-[#0071e3] text-white hover:bg-[#0058b0]"
                  }`}
                >
                  {added ? "Ajouté ✓" : "Ajouter au panier"}
                </button>
                <button
                  onClick={toggleFav}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
                    isFav ? "border-[#ff3b30] bg-[#ff3b30]/10 text-[#ff3b30]" : "border-[#d2d2d7] text-[#6e6e73] hover:border-[#1d1d1f]"
                  }`}
                  aria-label="Favoris"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Specs */}
              <div className="mt-8 space-y-3 border-t border-[#d2d2d7]/60 pt-6">
                <div className="flex items-center gap-3 text-[13px] text-[#6e6e73]">
                  <span>🚚</span> Livraison 24-48h
                </div>
                <div className="flex items-center gap-3 text-[13px] text-[#6e6e73]">
                  <span>💳</span> Paiement à la livraison
                </div>
                <div className="flex items-center gap-3 text-[13px] text-[#6e6e73]">
                  <span>🛡️</span> Garantie 12 mois
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
