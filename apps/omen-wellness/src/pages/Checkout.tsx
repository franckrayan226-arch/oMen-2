import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";

export default function Checkout() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clearCart = useCart((s) => s.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "Lomé" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app"}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: import.meta.env.VITE_STORE_ID_WELLNESS,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: { name: form.name, phone: form.phone, email: form.email },
          shippingAddress: { street: form.address, city: form.city, country: "Togo" },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur paiement");
      if (data.checkoutUrl) {
        clearCart();
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="px-4 text-center">
          <p className="text-[12px] text-[#17211a]/60">Panier vide</p>
          <Link to="/catalogue" className="btn-ink mt-4 inline-block rounded-full px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em]">Voir le catalogue</Link>
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
          <p className="label-mono px-1 text-[9px] text-[#b4552d]">Dernière étape</p>
          <h1 className="font-display mt-2 px-1 text-[26px] text-[#17211a] sm:text-[34px]">Paiement</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="glass rounded-3xl p-5">
              <h2 className="label-mono text-[9px] text-[#17211a]/60">Informations</h2>
              <div className="mt-4 space-y-2.5">
                <input type="text" required placeholder="Nom complet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]" />
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <input type="tel" required placeholder="+228 90 12 34 56" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]" />
                  <input type="email" placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]" />
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <h2 className="label-mono text-[9px] text-[#17211a]/60">Livraison</h2>
              <div className="mt-4 space-y-2.5">
                <input type="text" required placeholder="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]" />
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]">
                  <option>Lomé</option><option>Kara</option><option>Sokodé</option><option>Kpalimé</option>
                  <option>Ouagadougou</option><option>Bobo-Dioulasso</option><option>Koudougou</option>
                </select>
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <h2 className="label-mono text-[9px] text-[#17211a]/60">Récapitulatif</h2>
              <div className="mt-3">
                {items.map((i) => (
                  <div key={`${i.productId}-${i.variant}`} className="flex justify-between py-1.5 text-[11.5px] text-[#17211a]/70">
                    <span className="truncate">{i.name} ({i.variant}) × {i.quantity}</span>
                    <span className="shrink-0 pl-3 font-semibold text-[#17211a]">{(i.price * i.quantity).toLocaleString("fr-FR")} F</span>
                  </div>
                ))}
                <div className="glass-deep mt-3 flex items-center justify-between rounded-2xl px-4 py-3.5">
                  <span className="label-mono text-[9.5px]">Total</span>
                  <span className="text-[16px] font-bold">{total.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>
            </div>

            {error && <div className="rounded-2xl border border-[#b4552d]/40 bg-[#b4552d]/10 p-4 text-[11.5px] text-[#b4552d]">{error}</div>}

            <button type="submit" disabled={loading} className="btn-terra w-full rounded-full py-4 text-[11px] font-semibold uppercase tracking-[0.18em] disabled:opacity-50">
              {loading ? "Redirection..." : `Payer ${total.toLocaleString("fr-FR")} FCFA`}
            </button>
            <p className="text-center text-[9px] uppercase tracking-[0.2em] text-[#17211a]/45">Paiement sécurisé via GeniusPay</p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
