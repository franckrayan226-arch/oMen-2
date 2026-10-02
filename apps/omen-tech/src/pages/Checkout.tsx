import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";

const CITIES = ["Lomé", "Kara", "Sokodé", "Kpalimé", "Atakpamé", "Dédougou", "Bobo-Dioulasso", "Ouagadougou"];

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
      const res = await fetch(`${(import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "")}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: import.meta.env.VITE_STORE_ID_TECH,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: { name: form.name, phone: form.phone, email: form.email },
          shippingAddress: { street: form.address, city: form.city },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur commande");
      clearCart();
      window.location.href = `/commande/confirmee?ref=${data.reference || data.orderId}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center px-4">
            <p className="text-[14px] text-[#6e6e73]">Panier vide</p>
            <Link to="/catalogue" className="mt-4 inline-block text-[13px] font-medium text-[#0071e3] hover:underline">Voir les produits</Link>
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
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">Commande</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-[12px] font-medium text-[#6e6e73]">Nom complet</label>
              <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[14px] text-[#1d1d1f] outline-none transition-colors focus:border-[#0071e3]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#6e6e73]">Téléphone</label>
              <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+228 90 00 00 00"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[14px] text-[#1d1d1f] outline-none transition-colors focus:border-[#0071e3]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#6e6e73]">Email (optionnel)</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[14px] text-[#1d1d1f] outline-none transition-colors focus:border-[#0071e3]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#6e6e73]">Adresse</label>
              <input required type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[14px] text-[#1d1d1f] outline-none transition-colors focus:border-[#0071e3]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#6e6e73]">Ville</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-[14px] text-[#1d1d1f] outline-none transition-colors focus:border-[#0071e3]">
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {error && <p className="rounded-lg bg-[#ff3b30]/10 px-4 py-3 text-[13px] text-[#ff3b30]">{error}</p>}

            <div className="rounded-card border border-[#d2d2d7]/60 bg-[#fbfbfd] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#6e6e73]">Total ({items.length} article{items.length > 1 ? "s" : ""})</span>
                <span className="text-[20px] font-bold text-[#1d1d1f]">{total.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <p className="mt-2 text-[12px] text-[#86868b]">Paiement à la livraison</p>
            </div>

            <button type="submit" disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-btn bg-[#0071e3] text-[14px] font-medium text-white transition-colors hover:bg-[#0058b0] active:scale-[0.98] disabled:opacity-50">
              {loading ? "Traitement..." : `Confirmer — ${total.toLocaleString("fr-FR")} FCFA`}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
