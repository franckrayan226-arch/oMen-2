import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favoris() {
  const { items, removeItem } = useFavorites();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">Favoris</h1>

          {!items.length ? (
            <div className="mt-16 text-center">
              <p className="text-[14px] text-[#6e6e73]">Aucun favori pour le moment.</p>
              <Link to="/catalogue" className="mt-4 inline-flex h-11 items-center rounded-btn bg-[#0071e3] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#0058b0]">
                Découvrir les produits
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {items.map((item) => (
                <div key={item.productId} className="group relative rounded-card bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <Link to={`/produit/${item.slug}`}>
                    <div className="aspect-square overflow-hidden rounded-t-card bg-[#f5f5f7]">
                      {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#86868b]">{item.brand}</p>
                      <h3 className="mt-1 text-[14px] font-semibold text-[#1d1d1f] line-clamp-2">{item.name}</h3>
                      <p className="mt-2 text-[15px] font-semibold text-[#1d1d1f]">{item.price.toLocaleString("fr-FR")} FCFA</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#ff3b30] shadow-sm transition-colors hover:bg-[#ff3b30]/10"
                    aria-label="Retirer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
