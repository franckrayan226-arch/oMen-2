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
            <div className="glass mt-4 rounded-3xl py-20 text-center">
              <p className="label-mono text-[9px] text-[#b4552d]">Panier</p>
              <p className="font-display mt-3 text-[22px] text-[#17211a] sm:text-[26px]">Aucune préparation en cours</p>
              <p className="mt-2 text-[11.5px] text-[#17211a]/60">Compose ta routine dans le catalogue.</p>
              <Link to="/catalogue" className="btn-ink mt-6 inline-block rounded-full px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em]">Voir le catalogue</Link>
            </div>
          ) : (
            <>
              <p className="label-mono px-1 text-[9px] text-[#b4552d]">Commande en cours</p>
              <h1 className="font-display mt-2 px-1 text-[26px] text-[#17211a] sm:text-[34px]">Panier</h1>

              <div className="glass mt-5 rounded-3xl p-3 sm:p-5">
                {items.map((item, idx) => (
                  <div key={`${item.productId}-${item.variant}`} className={`flex gap-4 py-4 ${idx > 0 ? "border-t border-white/50" : ""}`}>
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#ece4d2] sm:h-24 sm:w-24">
                      {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="min-w-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="font-display truncate text-[14px] text-[#17211a] sm:text-[16px]">{item.name}</p>
                          <span className="shrink-0 text-[12px] font-bold text-[#17211a]">{(item.price * item.quantity).toLocaleString("fr-FR")} F</span>
                        </div>
                        <p className="label-mono mt-1 text-[8.5px] text-[#17211a]/55">{item.brand} — {item.variant}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="glass-soft flex items-center rounded-full">
                          <button onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-l-full text-[14px] text-[#17211a] active:bg-white/50">-</button>
                          <span className="w-8 text-center text-[12px] font-semibold text-[#17211a]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-r-full text-[14px] text-[#17211a] active:bg-white/50">+</button>
                        </div>
                        <button onClick={() => removeItem(item.productId, item.variant)} className="label-mono text-[8.5px] text-[#17211a]/45 hover:text-[#b4552d]">Retirer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass mt-4 overflow-hidden rounded-3xl">
                <div className="flex items-center justify-between px-5 py-4 text-[12px]">
                  <span className="text-[#17211a]/65">Sous-total</span>
                  <span className="font-semibold text-[#17211a]">{total.toLocaleString("fr-FR")} F</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/50 px-5 py-4 text-[12px]">
                  <span className="text-[#17211a]/65">Livraison</span>
                  <span className="font-semibold text-[#17211a]">Offerte</span>
                </div>
                <div className="glass-deep m-2 mt-0 flex items-center justify-between rounded-2xl px-4 py-4">
                  <span className="label-mono text-[9.5px]">Total</span>
                  <span className="text-[17px] font-bold">{total.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-terra mt-3 block rounded-full py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em]">Procéder au paiement</Link>
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
