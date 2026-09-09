import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Button from '@/components/ui/Button';
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { StickyCart } from "@/components/product/StickyCart";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";

import { Reveal } from '@/components/ui/Reveal';

const SIZES = ["38", "39", "40", "41", "42", "43", "44"];

const PRODUCTS: Record<string, { id: string; name: string; brand: string; price: number; description: string; colors: { name: string; hex: string }[]; images: string[] }> = {
  "nike-air-max-90": { id: "1", name: "Nike Air Max 90", brand: "Nike", price: 45000, description: "L'Air Max 90 revisité avec une bonde Air emblématique pour un confort tout-day.", colors: [{ name: "Noir/Blanc", hex: "#111" }, { name: "Blanc/Gris", hex: "#e5e5e5" }, { name: "Triple Noir", hex: "#1a1a1a" }], images: ["/shoes/nike-air-max-90.jpg", "/shoes/nike-air-force-1-og.jpg", "/shoes/nike-dunk-low.jpg"] },
  "jordan-1-retro-high": { id: "2", name: "Jordan 1 Retro High OG", brand: "Jordan", price: 75000, description: "L'original qui a tout lancé. Cuir premium et silhouète iconique.", colors: [{ name: "Bred", hex: "#111" }, { name: "Chicago", hex: "#c41e3a" }], images: ["/shoes/jordan-1.jpg", "/shoes/jordan-4-retro.jpg"] },
  "new-balance-550": { id: "3", name: "New Balance 550", brand: "New Balance", price: 38000, description: "Le classique revisité. Confort et style retro.", colors: [{ name: "Blanc", hex: "#f5f5f5" }, { name: "Gris", hex: "#999" }], images: ["/shoes/new-balance-550.jpg", "/shoes/nb-2002r.jpg"] },
  "adidas-samba-og": { id: "4", name: "adidas Samba OG", brand: "adidas", price: 42000, description: "Le Samba, iconique depuis les terrains de foot.", colors: [{ name: "Noir", hex: "#111" }, { name: "Blanc", hex: "#f5f5f5" }], images: ["/shoes/adidas-samba-og.jpg", "/shoes/adidas-stan.jpg"] },
  "nike-dunk-low": { id: "5", name: "Nike Dunk Low Retro", brand: "Nike", price: 48000, description: "Le Dunk, né sur les courts, devenu icône de la rue.", colors: [{ name: "Panda", hex: "#111" }, { name: "University", hex: "#c41e3a" }], images: ["/shoes/nike-dunk-low.jpg", "/shoes/nike-air-max-90.jpg"] },
  "jordan-4-retro": { id: "6", name: "Jordan 4 Retro", brand: "Jordan", price: 85000, description: "La Jordan 4, aérodynamique et audacieuse.", colors: [{ name: "Bred", hex: "#111" }, { name: "White Cement", hex: "#e5e5e5" }], images: ["/shoes/jordan-4-retro.jpg", "/shoes/jordan-1.jpg"] },
  "puma-suede-classic": { id: "7", name: "Puma Suede Classic", brand: "Puma", price: 32000, description: "Le Suede, icône du streetwear depuis 1968.", colors: [{ name: "Noir", hex: "#111" }, { name: "Bleu", hex: "#1e40af" }], images: ["/shoes/puma-suede-classic.jpg"] },
  "lv-trainer": { id: "8", name: "Louis Vuitton LV Trainer", brand: "Louis Vuitton", price: 120000, description: "Le LV Trainer, luxe et streetwear réunis. Calf leather et Monogram.", colors: [{ name: "Blanc", hex: "#f5f5f5" }, { name: "Noir", hex: "#111" }], images: ["/shoes/lv-trainer.jpg"] },
  "nike-air-force-1": { id: "9", name: "Nike Air Force 1 '07", brand: "Nike", price: 40000, description: "L'Air Force 1, pionnier de la sneaker culture.", colors: [{ name: "Blanc", hex: "#f5f5f5" }, { name: "Noir", hex: "#111" }], images: ["/shoes/nike-air-force-1-og.jpg", "/shoes/nike-air-max-90.jpg"] },
  "adidas-stan-smith": { id: "10", name: "adidas Stan Smith", brand: "adidas", price: 35000, description: "Le Stan Smith, élégance tennis depuis 1971.", colors: [{ name: "Blanc", hex: "#f5f5f5" }, { name: "Noir", hex: "#111" }], images: ["/shoes/adidas-stan.jpg", "/shoes/adidas-samba-og.jpg"] },
  "new-balance-2002r": { id: "11", name: "New Balance 2002R", brand: "New Balance", price: 52000, description: "Le 2002R, confort running et style moderne.", colors: [{ name: "Gris", hex: "#888" }, { name: "Noir", hex: "#111" }], images: ["/shoes/nb-2002r.jpg", "/shoes/new-balance-550.jpg"] },
  "vans-old-skool": { id: "12", name: "Vans Old Skool", brand: "Vans", price: 25000, description: "L'Old Skool, le skate shoe par excellence.", colors: [{ name: "Noir", hex: "#111" }, { name: "Blanc", hex: "#f5f5f5" }], images: ["/shoes/vans.jpg", "/shoes/puma-suede-classic.jpg"] },
};

export default function Product() {
  const { slug } = useParams();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const { items: favItems, addItem: addFav, removeItem: removeFav } = useFavorites();
  const navigate = useNavigate();

  const product = PRODUCTS[slug || ""] || PRODUCTS["nike-air-max-90"];
  const isFav = favItems.some((i) => i.productId === product.id);

  const handleAdd = () => {
    if (!selectedSize) { setShowSizes(true); return; }
    addItem({ productId: product.id, slug: slug || "", name: product.name, brand: product.brand, price: product.price, image: product.images[0] || "", size: selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleFav = () => {
    if (isFav) { removeFav(product.id); }
    else { addFav({ productId: product.id, slug: slug || "", name: product.name, brand: product.brand, price: product.price, image: product.images[0] || "" }); }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-28 sm:pb-0">
        <div className="mx-auto max-w-7xl">
          <div className="px-3 pt-3 sm:px-6 sm:pt-6">
            <nav className="text-[11px] text-[#666] sm:text-[12px]">
              <Link to="/" className="hover:text-[#1d4ed8]">Accueil</Link>
              <span className="mx-1">/</span>
              <Link to="/catalogue" className="hover:text-[#1d4ed8]">Catalogue</Link>
              <span className="mx-1">/</span>
              <span className="font-medium text-[#111]">{product.name}</span>
            </nav>
          </div>

          <div className="mt-4 sm:mt-8 sm:px-6">
            <Reveal>
              <div className="relative aspect-square sm:aspect-video overflow-hidden rounded-none sm:rounded-3xl glass shadow-2xl shadow-black/5" style={{ border: "1px solid #e0d6d0" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#f0ebe7]/50 to-white/20 mix-blend-overlay z-0" />
                <img src={product.images[0]} alt={product.name} className="relative z-10 h-full w-full object-cover sm:object-contain sm:p-12 hover:scale-105 transition-transform duration-1000 ease-out" />
                
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-col gap-2">
                  <span className="w-fit rounded-full bg-white/80 backdrop-blur-md px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8]" style={{ border: "1px solid #e0d6d0" }}>Nouveau</span>
                  <span className="w-fit rounded-full bg-white/80 backdrop-blur-md px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#111]" style={{ border: "1px solid #e0d6d0" }}>Édition Limitée</span>
                </div>
                
                <button onClick={toggleFav} className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white" style={{ border: "1px solid #e0d6d0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                  <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${isFav ? "fill-[#1d4ed8] text-[#1d4ed8]" : "text-[#111]"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>
            </Reveal>
          </div>

          <div className="px-3 pt-6 pb-4 sm:px-6 sm:pt-12 max-w-3xl mx-auto sm:mx-0">
            <Reveal delay={100}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-[#FFD700]">
                  {[1, 2, 3, 4, 5].map(star => <svg key={star} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <span className="text-[11px] font-medium text-[#666]">(128 avis)</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8] sm:text-[11px]">{product.brand}</p>
              <h1 className="mt-1 text-3xl text-[#111] sm:text-5xl lg:text-6xl" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontWeight: 800, lineHeight: 1.1 }}>{product.name}</h1>
              <p className="mt-4 text-[14px] leading-relaxed text-[#666] sm:text-[16px] max-w-2xl">{product.description} Conçue avec une attention méticuleuse aux détails, cette paire incarne l'alliance parfaite entre héritage culturel et innovation moderne.</p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-5">
                <p className="mb-2 text-[12px] font-semibold text-[#111]">Couleur — <span className="font-normal text-[#666]">{product.colors[selectedColor]?.name}</span></p>
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <button key={c.name} onClick={() => setSelectedColor(i)} className={`h-9 w-9 rounded-full border-2 transition-all ${i === selectedColor ? "border-[#1d4ed8] scale-110" : "border-[#e0d6d0]"}`} style={{ background: c.hex }} aria-label={c.name} />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[12px] font-semibold text-[#111]">Taille {selectedSize && <span className="font-normal">— {selectedSize}</span>}</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => { setSelectedSize(s); setShowSizes(false); }} className={`h-11 min-w-[44px] rounded-lg px-3 text-[13px] font-medium transition-colors ${selectedSize === s ? "btn-primary" : "btn-secondary"}`}>{s}</button>
                  ))}
                </div>
                {showSizes && !selectedSize && <p className="mt-1.5 text-[11px] text-red-500">Sélectionne ta taille</p>}
              </div>
            </Reveal>
            
            <Reveal delay={300}>
              <div className="mt-6 hidden sm:block space-y-3 max-w-sm">
                <Button variant="brand" className="w-full text-[15px] py-4" onClick={handleAdd} disabled={added}>
                  {added ? "Ajouté au panier" : "Ajouter au panier"}
                </Button>
                <Button variant="secondary" className="w-full text-[15px] py-4" onClick={() => { handleAdd(); navigate('/checkout'); }}>
                  Acheter maintenant
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-[11px] text-[#666] sm:text-[12px] border-t border-[#e0d6d0] pt-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  <span>Livraison 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Authentique</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <span>Paiement sûr</span>
                </div>
              </div>
            </Reveal>
            
            <Reveal delay={400}>
              <div className="mt-12 p-6 sm:p-8 rounded-3xl glass text-left" style={{ border: "1px solid #e0d6d0" }}>
                <h3 className="text-[16px] sm:text-[20px] font-bold text-[#111] mb-4" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>L'art du détail</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#111] mb-1">Matériaux Premium</h4>
                    <p className="text-[13px] text-[#666] leading-relaxed">Sélection rigoureuse des cuirs et toiles pour une durabilité et un confort absolus, conçus pour résister au temps.</p>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#111] mb-1">Design Ergonomique</h4>
                    <p className="text-[13px] text-[#666] leading-relaxed">Semelle étudiée pour épouser la forme de votre pied, offrant un amorti parfait à chaque pas.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <StickyCart productId={product.id} slug={slug || ""} name={product.name} brand={product.brand} price={product.price} image={product.images[0] || ""} selectedSize={selectedSize} onSelectSize={() => setShowSizes(true)} />
    </div>
  );
}
