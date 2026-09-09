import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const total = useCart((s) => s.total());

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-12">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1d4ed8]/10">
                <svg className="h-8 w-8 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#111]">Panier vide</p>
              <p className="mt-1 text-[12px] text-[#666]">Ajoute des paires pour commencer.</p>
              <Link to="/catalogue" className="mt-4 inline-block rounded-lg bg-[#1d4ed8] px-5 py-2.5 text-[12px] font-semibold text-white">Voir le catalogue</Link>
            </div>
          ) : (
            <>
              <div className="space-y-2 sm:space-y-3">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3 rounded-xl bg-white p-3 sm:gap-4 sm:p-4" style={{ border: "1px solid #e0d6d0" }}>
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f0ebe7] sm:h-24 sm:w-24" style={{ border: "1px solid #e0d6d0" }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#1d4ed8] sm:text-[10px]">{item.brand}</p>
                        <p className="text-[13px] font-semibold text-[#111] truncate sm:text-[14px]">{item.name}</p>
                        <p className="text-[11px] text-[#666]">Taille {item.size}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="btn-secondary flex h-7 w-7 items-center justify-center rounded-lg text-[14px]">-</button>
                          <span className="w-5 text-center text-[13px] font-medium text-[#111]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="btn-secondary flex h-7 w-7 items-center justify-center rounded-lg text-[14px]">+</button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-[#111] sm:text-[14px]">{(item.price * item.quantity).toLocaleString("fr-FR")} FCFA</span>
                          <button onClick={() => removeItem(item.productId, item.size)} className="text-[14px] text-[#999]">✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-white p-4 sm:mt-8 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#666]">Sous-total</span>
                  <span className="font-medium text-[#111]">{total.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[13px]">
                  <span className="text-[#666]">Livraison</span>
                  <span className="font-medium text-[#111]">Gratuite</span>
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e0d6d0" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#111]">Total</span>
                    <span className="text-lg font-black text-[#111]">{total.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
                <Link to="/checkout" className="mt-3 block w-full rounded-lg bg-[#1d4ed8] py-3.5 text-center text-[14px] font-semibold text-white active:scale-[0.98] sm:mt-4">Procéder au paiement</Link>
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
