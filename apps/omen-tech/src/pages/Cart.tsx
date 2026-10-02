import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  if (!items.length) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center px-4">
            <p className="text-[14px] text-[#6e6e73]">Votre panier est vide</p>
            <Link to="/catalogue" className="mt-4 inline-flex h-11 items-center rounded-btn bg-[#0071e3] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#0058b0]">
              Voir les produits
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">Panier</h1>

          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-4 rounded-card border border-[#d2d2d7]/60 bg-white p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f7]">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-[14px] font-semibold text-[#1d1d1f]">{item.name}</p>
                  <p className="mt-0.5 text-[12px] text-[#86868b]">{item.size && `Taille ${item.size}`}</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#1d1d1f]">{item.price.toLocaleString("fr-FR")} FCFA</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.productId, item.size)} className="text-[12px] text-[#86868b] hover:text-[#ff3b30]">
                    Retirer
                  </button>
                  <div className="flex items-center gap-2 rounded-full border border-[#d2d2d7] px-2 py-1">
                    <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="flex h-6 w-6 items-center justify-center text-[14px] text-[#6e6e73] hover:text-[#1d1d1f]">−</button>
                    <span className="min-w-5 text-center text-[13px] font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="flex h-6 w-6 items-center justify-center text-[14px] text-[#6e6e73] hover:text-[#1d1d1f]">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-card border border-[#d2d2d7]/60 bg-[#fbfbfd] p-6">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-[#6e6e73]">Total</span>
              <span className="text-[22px] font-bold text-[#1d1d1f]">{total.toLocaleString("fr-FR")} FCFA</span>
            </div>
            <Link
              to="/checkout"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-btn bg-[#0071e3] text-[14px] font-medium text-white transition-colors hover:bg-[#0058b0] active:scale-[0.98]"
            >
              Commander
            </Link>
            <p className="mt-3 text-center text-[12px] text-[#86868b]">Paiement à la livraison</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
