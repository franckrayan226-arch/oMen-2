import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { StickyCart } from "@/components/product/StickyCart";
import { Reveal } from "@/components/ui/Reveal";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useProduct } from "@/hooks/useProducts";
import { getProduct } from "@/data/products";

function resolveImage(url: string | undefined): string {
  if (!url) return "";
  const API = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
  if (url.startsWith("http")) return url;
  return `${API}${url}`;
}

export default function Product() {
  const { slug } = useParams();
  const { product: apiProduct, loading } = useProduct(slug || "");
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const { items: favItems, addItem: addFav, removeItem: removeFav } = useFavorites();
  const navigate = useNavigate();

  const staticProduct = getProduct(slug || "") || getProduct("minoxidil-5");
  const product = apiProduct ? {
    id: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    brand: apiProduct.brand || "Omen Lab",
    category: apiProduct.category || "",
    price: apiProduct.price,
    compareAt: apiProduct.compareAt,
    badge: apiProduct.badge || null,
    image: resolveImage(apiProduct.images?.[0]?.url) || resolveImage(apiProduct.colors?.[0]?.images?.[0]?.url) || staticProduct!.image,
    description: apiProduct.description || staticProduct!.description,
    ritual: staticProduct!.ritual,
    actives: staticProduct!.actives,
    variants: apiProduct.variants?.length
      ? apiProduct.variants.map((v: any) => ({ label: v.size, price: v.price || apiProduct.price, compareAt: v.compareAt }))
      : staticProduct!.variants,
  } : (loading ? { ...staticProduct!, image: "", variants: [] } : staticProduct!);

  const isFav = favItems.some((i) => i.productId === product.id);

  useEffect(() => {
    setSelectedVariant(null);
  }, [slug]);

  const handleAdd = () => {
    if (selectedVariant === null) {
      setShowVariants(true);
      return;
    }
    const v = product.variants[selectedVariant];
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: v.price,
      image: product.image,
      variant: v.label,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleFav = () => {
    if (isFav) removeFav(product.id);
    else addFav({ productId: product.id, slug: product.slug, name: product.name, brand: product.brand, price: product.variants[0].price, image: product.image });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-28 sm:pb-0">
        <div className="mx-auto max-w-7xl px-3 pt-2 sm:px-6 sm:pt-4">
          <nav className="px-1 text-[10px] uppercase tracking-[0.14em] text-[#17211a]/55">
            <Link to="/" className="hover:text-[#17211a]">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/catalogue" className="hover:text-[#17211a]">Catalogue</Link>
            <span className="mx-2">/</span>
            <span className="text-[#17211a]">{product.name}</span>
          </nav>

          <div className="mt-4 grid gap-5 sm:mt-6 sm:grid-cols-2 sm:gap-8 lg:gap-12">
            <Reveal>
              <div className="glass overflow-hidden rounded-3xl">
                <div className="relative overflow-hidden rounded-[22px] bg-[#ece4d2] m-1.5">
                  <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
                  {product.badge && <span className="tag-glass tag-glass-dark absolute left-3 top-3">{product.badge}</span>}
                </div>
                <div className="flex items-center justify-between px-5 pb-4 pt-1">
                  <span className="label-mono text-[9px] text-[#17211a]/55">Fiche N°{product.id.padStart(2, "0")}</span>
                  <button onClick={toggleFav} className="label-mono text-[9px] text-[#b4552d] hover:underline">
                    {isFav ? "Retirer des favoris" : "Ajouter aux favoris +"}
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="glass-soft rounded-3xl p-5 sm:p-8">
                <p className="label-mono text-[9px] text-[#b4552d] sm:text-[10px]">{product.category} — {product.brand}</p>
                <h1 className="font-display mt-3 text-[30px] leading-tight text-[#17211a] sm:text-[42px]">{product.name}</h1>
                <p className="mt-4 text-[12px] leading-relaxed text-[#17211a]/70 sm:text-[13px]">{product.description}</p>

                <div className="mt-5 flex items-baseline gap-3 border-t border-white/50 pt-5">
                  <span className="text-[20px] font-bold text-[#17211a] sm:text-[24px]">
                    {(selectedVariant !== null ? product.variants[selectedVariant].price : product.variants[0].price).toLocaleString("fr-FR")} F
                  </span>
                  {selectedVariant !== null && product.variants[selectedVariant].compareAt && (
                    <span className="text-[12px] text-[#17211a]/45 line-through">{product.variants[selectedVariant].compareAt!.toLocaleString("fr-FR")} F</span>
                  )}
                  {selectedVariant === null && <span className="text-[9.5px] uppercase tracking-[0.16em] text-[#17211a]/45">— selon format</span>}
                </div>

                <div className="mt-5">
                  <p className="label-mono mb-2.5 text-[9px] text-[#17211a]">Format {selectedVariant !== null && <span className="font-normal text-[#17211a]/55">— {product.variants[selectedVariant].label}</span>}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v: { label: string; price: number; compareAt?: number }, i: number) => (
                      <button key={v.label} onClick={() => { setSelectedVariant(i); setShowVariants(false); }} className={`min-w-[130px] rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.98] ${selectedVariant === i ? "btn-ink" : "btn-glass"}`}>
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.1em]">{v.label}</span>
                        <span className={`mt-0.5 block text-[10px] ${selectedVariant === i ? "text-[#f4efe3]/70" : "text-[#17211a]/55"}`}>{v.price.toLocaleString("fr-FR")} FCFA</span>
                      </button>
                    ))}
                  </div>
                  {showVariants && selectedVariant === null && <p className="mt-2 text-[10px] text-[#b4552d]">Choisis un format.</p>}
                </div>

                <div className="mt-7 space-y-2.5">
                  <button onClick={handleAdd} disabled={added} className="btn-terra w-full rounded-full py-4 text-[11px] font-semibold uppercase tracking-[0.18em] disabled:opacity-60">
                    {added ? "Ajouté au panier" : "Ajouter au panier"}
                  </button>
                  <button onClick={() => { if (selectedVariant === null) { setShowVariants(true); return; } handleAdd(); navigate("/checkout"); }} className="btn-glass w-full rounded-full py-4 text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Acheter maintenant
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/50 bg-white/30 py-3.5 text-center">
                  <div>
                    <p className="label-mono text-[7.5px] text-[#17211a]/50">Livraison</p>
                    <p className="mt-1 text-[10.5px] text-[#17211a]">24h Lomé</p>
                  </div>
                  <div className="border-x border-white/50">
                    <p className="label-mono text-[7.5px] text-[#17211a]/50">Sceau</p>
                    <p className="mt-1 text-[10.5px] text-[#17211a]">Origine</p>
                  </div>
                  <div>
                    <p className="label-mono text-[7.5px] text-[#17211a]/50">Paiement</p>
                    <p className="mt-1 text-[10.5px] text-[#17211a]">Wave · OM · MoMo</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-6 sm:mt-10">
            <div className="grid gap-3 sm:grid-cols-2">
              <Reveal>
                <div className="glass h-full rounded-3xl p-6 sm:p-9">
                  <p className="label-mono text-[9px] text-[#b4552d]">Protocole</p>
                  <h3 className="font-display mt-2 text-[20px] text-[#17211a] sm:text-[24px]">Le rituel</h3>
                  <ol className="mt-5">
                    {product.ritual.map((step, i) => (
                      <li key={i} className="flex gap-4 border-t border-white/50 py-3.5 text-[12px] leading-relaxed text-[#17211a]/75">
                        <span className="font-display-italic shrink-0 text-[#b4552d]">{String(i + 1).padStart(2, "0")}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="glass-deep h-full rounded-3xl p-6 sm:p-9">
                  <p className="label-mono text-[9px] text-[#e0a37f]">Composition</p>
                  <h3 className="font-display mt-2 text-[20px] sm:text-[24px]">La formule</h3>
                  <p className="mt-4 text-[12px] leading-relaxed text-[#f4efe3]/80">{product.actives}</p>
                  <div className="mt-6 space-y-2 border-t border-white/12 pt-5 text-[10.5px] leading-relaxed text-[#f4efe3]/60">
                    <p>Usage externe uniquement. Tenir hors de portée des enfants.</p>
                    <p>En cas d'irritation, espacer les applications ou interrompre.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <StickyCart productId={product.id} slug={product.slug} name={product.name} brand={product.brand} price={product.variants[selectedVariant ?? 0].price} image={product.image} variant={selectedVariant === null ? null : product.variants[selectedVariant].label} onNeedVariant={() => setShowVariants(true)} />
    </div>
  );
}
