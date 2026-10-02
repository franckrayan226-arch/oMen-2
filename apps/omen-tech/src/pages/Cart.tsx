import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export default function Cart() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  if (!items.length) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="px-4 text-center">
            <p className="text-[14px] text-[#999]">Votre panier est vide.</p>
            <Link
              to="/catalogue"
              className="mt-5 inline-block bg-[#111] px-6 py-3 text-[13px] font-medium text-white transition-opacity hover:opacity-80"
            >
              Voir les produits
            </Link>
          </div>
        </main>
        <Footer />
      <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-[860px] px-5 py-12 lg:px-0 lg:py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">Étape 1</p>
          <h1 className="mt-3 text-[34px] font-bold uppercase tracking-[-0.02em] lg:text-[44px]">Panier</h1>

          <div className="mt-10 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-4 py-5">
                <div className="h-20 w-20 shrink-0 overflow-hidden bg-[#f0f0f0]">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-[14px] text-[#111]">{item.name}</p>
                  <p className="mt-0.5 text-[12px] text-[#999]">
                    {item.brand}
                    {item.size ? ` · ${item.size}` : ""}
                  </p>
                  <p className="mt-auto pt-2 text-[14px] font-medium">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-[12px] text-[#999] underline underline-offset-2 transition-colors hover:text-[#111]"
                  >
                    Retirer
                  </button>
                  <div className="flex items-center border border-[#e5e5e5]">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-[14px] text-[#555] transition-colors hover:text-[#111]"
                    >
                      &minus;
                    </button>
                    <span className="min-w-6 text-center text-[13px]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-[14px] text-[#555] transition-colors hover:text-[#111]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-end gap-4">
            <div className="flex w-full items-baseline justify-between border-b border-[#e5e5e5] pb-4">
              <span className="text-[14px] text-[#555]">Total</span>
              <span className="text-[24px] font-light tracking-tight">{formatPrice(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-[#111] py-4 text-center text-[13px] font-medium text-white transition-opacity hover:opacity-80"
            >
              Passer la commande
            </Link>
            <p className="text-[12px] text-[#999]">Paiement à la livraison</p>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
