import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

const CITY_COUNTRY: Record<string, string> = {
  "Ouagadougou": "Burkina Faso",
  "Bobo-Dioulasso": "Burkina Faso",
  "Koudougou": "Burkina Faso",
};

export default function Checkout() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clearCart = useCart((s) => s.clearCart);
  const addOrder = useAuth((s) => s.addOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "Lomé" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${(import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "")}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: import.meta.env.VITE_STORE_ID_SHOES,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: { name: form.name, phone: form.phone, email: form.email },
          shippingAddress: { street: form.address, city: form.city, country: CITY_COUNTRY[form.city] ?? "Togo" },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur paiement");
      if (data.checkoutUrl) {
        // rattacher la commande au compte connecté (silencieux si invité)
        addOrder({
          items: items.map((i) => ({
            productId: i.productId,
            slug: i.slug,
            name: i.name,
            brand: i.brand,
            price: i.price,
            image: i.image,
            size: i.size,
            quantity: i.quantity,
          })),
          total,
          city: form.city,
          status: "confirmee",
          paymentMethod: "GeniusPay",
        });
        clearCart();
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  if (!items.length) return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[13px] text-[#666]">Panier vide</p>
          <Link to="/catalogue" className="mt-3 inline-block rounded-lg bg-[#1d4ed8] px-5 py-2.5 text-[12px] font-semibold text-white">Voir le catalogue</Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-12">
          <h1 className="text-[22px] font-black text-[#111] sm:text-[28px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Checkout</h1>
          <form onSubmit={handleSubmit} className="mt-5 space-y-3 sm:mt-8 sm:space-y-5">
            <div className="space-y-3 rounded-xl bg-white p-4 sm:space-y-4 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
              <h2 className="text-[13px] font-bold text-[#111] sm:text-sm">Informations</h2>
              <input type="text" required placeholder="Nom complet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]" />
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <input type="tel" required placeholder="+228 90 12 34 56" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]" />
                <input type="email" placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]" />
              </div>
            </div>

            <div className="space-y-3 rounded-xl bg-white p-4 sm:space-y-4 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
              <h2 className="text-[13px] font-bold text-[#111] sm:text-sm">Livraison</h2>
              <input type="text" required placeholder="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]" />
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111]">
                <option>Lomé</option><option>Kara</option><option>Sokodé</option><option>Kpalimé</option>
                <option>Ouagadougou</option><option>Bobo-Dioulasso</option><option>Koudougou</option>
              </select>
            </div>

            <div className="rounded-xl bg-white p-4 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
              <h2 className="mb-2 text-[13px] font-bold text-[#111] sm:mb-3 sm:text-sm">Récapitulatif</h2>
              {items.map((i) => <div key={`${i.productId}-${i.size}`} className="flex justify-between text-[12px] text-[#666] py-0.5 sm:text-[13px]"><span className="truncate">{i.name} ({i.size}) × {i.quantity}</span><span className="shrink-0 pl-2 font-medium text-[#111]">{(i.price * i.quantity).toLocaleString("fr-FR")} FCFA</span></div>)}
              <div className="mt-2 pt-2 flex items-center justify-between sm:mt-3 sm:pt-3" style={{ borderTop: "1px solid #e0d6d0" }}><span className="text-[13px] font-bold text-[#111] sm:text-sm">Total</span><span className="text-lg font-black text-[#111]">{total.toLocaleString("fr-FR")} FCFA</span></div>
            </div>

            {error && <div className="rounded-lg bg-red-50 p-3 text-[12px] text-red-600 sm:text-[13px]">{error}</div>}

            <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#1d4ed8] py-3.5 text-[14px] font-semibold text-white active:scale-[0.98] disabled:opacity-50 sm:py-4">
              {loading ? "Redirection..." : `Payer ${total.toLocaleString("fr-FR")} FCFA`}
            </button>
            <p className="text-center text-[10px] text-[#999] sm:text-[11px]">Paiement sécurisé via GeniusPay</p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
