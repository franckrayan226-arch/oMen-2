import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { useFavorites } from "@/hooks/useFavorites";
import { formatPrice } from "@/lib/format";

export default function Favoris() {
  const { items, removeItem } = useFavorites();

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">Sélection</p>
          <h1 className="mt-3 text-[36px] font-light tracking-tight lg:text-[48px]">Favoris</h1>

          {!items.length ? (
            <div className="mt-20 text-center">
              <p className="text-[14px] text-[#999]">Aucun favori pour le moment.</p>
              <Link
                to="/catalogue"
                className="mt-5 inline-block bg-[#111] px-6 py-3 text-[13px] font-medium text-white transition-opacity hover:opacity-80"
              >
                Découvrir les produits
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <div key={item.productId} className="group relative">
                  <Link to={`/produit/${item.slug}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      )}
                    </div>
                    <div className="mt-3.5 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] text-[#111]">{item.name}</p>
                        <p className="mt-0.5 truncate text-[12px] text-[#999]">{item.brand}</p>
                      </div>
                      <p className="shrink-0 text-[14px] font-medium">{formatPrice(item.price)}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-white/90 text-[#111] opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
                    aria-label="Retirer"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
