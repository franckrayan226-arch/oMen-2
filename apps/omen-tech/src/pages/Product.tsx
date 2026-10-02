import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { formatPrice } from "@/lib/format";

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProduct(slug || "");
  const addItem = useCart((s) => s.addItem);
  const { items: favs, addItem: addFav, removeItem: removeFav } = useFavorites();
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
        <Navbar />
        <main className="mx-auto w-full max-w-[1400px] px-5 py-10 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="skeleton aspect-[4/5] w-full" />
            <div className="space-y-4">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-6 w-32" />
              <div className="skeleton h-24 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      <BottomNav />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-[14px] text-[#999]">Produit introuvable.</p>
            <Link
              to="/catalogue"
              className="mt-4 inline-block text-[13px] font-medium underline underline-offset-4 text-[#555] hover:text-[#111]"
            >
              Retour au catalogue
            </Link>
          </div>
        </main>
        <Footer />
      <BottomNav />
      </div>
    );
  }

  const resolve = (u?: string) =>
    !u ? "" : u.startsWith("http") || u.startsWith("/tech/") ? u : `${(import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "")}${u}`;

  const images: string[] = [
    ...(product.images?.map((i: any) => resolve(i.url)) || []),
    ...(product.colors?.flatMap((c: any) => c.images?.map((i: any) => resolve(i.url)) || []) || []),
  ].filter(Boolean);
  const mainImage = images[selectedImage] || images[0] || "";
  const isFav = favs.some((f) => f.productId === product.id);
  const variants = product.variants || [];
  const sizes: string[] = [...new Set(variants.map((v: any) => v.size).filter(Boolean))] as string[];

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand || product.category || "",
      price: product.price,
      image: mainImage,
      size: selectedSize || sizes[0] || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleFav = () => {
    if (isFav) removeFav(product.id);
    else
      addFav({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand || "",
        price: product.price,
        image: mainImage,
      });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-10 lg:py-12">
          <Link
            to="/catalogue"
            className="text-[13px] text-[#999] transition-colors hover:text-[#111]"
          >
            &larr; Boutique
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="aspect-[4/5] overflow-hidden bg-[#f0f0f0]">
                {mainImage ? (
                  <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[13px] text-[#999]">
                    Pas d&rsquo;image
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`h-16 w-16 shrink-0 overflow-hidden border transition-all ${
                        selectedImage === i
                          ? "border-[#111]"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col lg:pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">
                {product.category}
              </p>
              <h1 className="mt-3 text-[30px] font-light leading-tight tracking-tight lg:text-[40px]">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-[20px] font-medium">{formatPrice(product.price)}</span>
                {product.compareAt && product.compareAt > product.price && (
                  <span className="text-[15px] text-[#999] line-through">
                    {formatPrice(product.compareAt)}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-5 max-w-[440px] text-[14px] leading-relaxed text-[#555]">
                  {product.description}
                </p>
              )}

              {sizes.length > 0 && (
                <div className="mt-7">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">
                    Options
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sizes.map((s: string) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[44px] border px-4 py-2 text-[13px] transition-colors ${
                          (selectedSize || sizes[0]) === s
                            ? "border-[#111] bg-[#111] text-white"
                            : "border-[#e5e5e5] text-[#555] hover:border-[#111] hover:text-[#111]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleAdd}
                  className={`h-12 flex-1 text-[13px] font-medium transition-colors duration-200 ${
                    added ? "bg-[#555] text-white" : "bg-[#111] text-white hover:opacity-80"
                  }`}
                >
                  {added ? "Ajouté" : "Ajouter au panier"}
                </button>
                <button
                  onClick={toggleFav}
                  className={`flex h-12 w-12 items-center justify-center border transition-colors ${
                    isFav
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-[#e5e5e5] text-[#555] hover:border-[#111] hover:text-[#111]"
                  }`}
                  aria-label="Favoris"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isFav ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>

              <div className="mt-8 space-y-3 border-t border-[#e5e5e5] pt-6">
                {[
                  "Livraison en 24-48h",
                  "Paiement à la livraison",
                  "Garantie 12 mois",
                ].map((line) => (
                  <div key={line} className="flex items-center gap-3 text-[13px] text-[#555]">
                    <span className="h-1 w-1 rounded-full bg-[#999]" />
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
