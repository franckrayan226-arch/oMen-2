import { Link, useNavigate } from "react-router-dom";
import Button from '@/components/ui/Button';
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favoris() {
  const items = useFavorites((s) => s.items);
  const removeItem = useFavorites((s) => s.removeItem);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-12">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1d4ed8]/10">
                <svg className="h-8 w-8 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#111]">Aucun favori</p>
              <p className="mt-1 text-[12px] text-[#666]">Ajoute des paires pour les retrouver ici.</p>
              <Button variant="brand" className="mt-4 inline-block" onClick={() => {}}>
              Voir le catalogue
            </Button>
            </div>
          ) : (
            <>
              <h1 className="text-[22px] text-[#111] sm:text-[28px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Mes favoris</h1>
              <p className="mt-1 text-[12px] text-[#666]">{items.length} {items.length === 1 ? "paire" : "paires"}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-3">
                {items.map((item) => (
                  <div key={item.productId} className="group relative overflow-hidden rounded-xl bg-white" style={{ border: "1px solid #e0d6d0" }}>
                    <Link to={`/produit/${item.slug}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-[#f0ebe7]">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1d4ed8] sm:text-[10px]">{item.brand}</p>
                        <h3 className="mt-0.5 text-[12px] font-semibold text-[#111] leading-tight sm:text-[13px]">{item.name}</h3>
                        <p className="mt-0.5 text-[11px] font-bold text-[#111]">{item.price.toLocaleString("fr-FR")} <span className="text-[9px] font-medium text-[#666]">FCFA</span></p>
                      </div>
                    </Link>
                    <button onClick={() => removeItem(item.productId)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#111] transition-colors hover:bg-[#fee2e2] hover:text-red-500" style={{ border: "1px solid #e0d6d0" }} aria-label="Retirer des favoris">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
      <div className="h-20 sm:hidden" />
    </div>
  );
}
