import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favoris() {
  const items = useFavorites((s) => s.items);
  const removeItem = useFavorites((s) => s.removeItem);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-12">
          {items.length === 0 ? (
            <div className="glass mt-4 rounded-3xl py-20 text-center">
              <p className="label-mono text-[9px] text-[#b4552d]">Favoris</p>
              <p className="font-display mt-3 text-[22px] text-[#17211a] sm:text-[26px]">Rien de mis de côté</p>
              <p className="mt-2 text-[11.5px] text-[#17211a]/60">Les fiches que tu suis apparaîtront ici.</p>
              <Link to="/catalogue" className="btn-ink mt-6 inline-block rounded-full px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em]">Voir le catalogue</Link>
            </div>
          ) : (
            <>
              <p className="label-mono px-1 text-[9px] text-[#b4552d]">Suivis</p>
              <h1 className="font-display mt-2 px-1 text-[26px] text-[#17211a] sm:text-[34px]">Favoris</h1>

              <div className="glass mt-5 rounded-3xl p-3 sm:p-5">
                {items.map((item, idx) => (
                  <div key={item.productId} className={`flex items-center gap-4 py-3.5 ${idx > 0 ? "border-t border-white/50" : ""}`}>
                    <Link to={`/produit/${item.slug}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#ece4d2] sm:h-20 sm:w-20">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    </Link>
                    <Link to={`/produit/${item.slug}`} className="min-w-0 flex-1">
                      <p className="font-display truncate text-[14px] text-[#17211a] sm:text-[16px]">{item.name}</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#17211a]/70">{item.price.toLocaleString("fr-FR")} FCFA</p>
                    </Link>
                    <button onClick={() => removeItem(item.productId)} className="label-mono shrink-0 text-[8.5px] text-[#17211a]/45 hover:text-[#b4552d]">Retirer</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
