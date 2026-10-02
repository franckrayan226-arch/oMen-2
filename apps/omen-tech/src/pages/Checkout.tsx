import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

const CITIES: { name: string; country: string }[] = [
  { name: "Lomé", country: "Togo" },
  { name: "Kara", country: "Togo" },
  { name: "Sokodé", country: "Togo" },
  { name: "Kpalimé", country: "Togo" },
  { name: "Atakpamé", country: "Togo" },
  { name: "Ouagadougou", country: "Burkina Faso" },
  { name: "Bobo-Dioulasso", country: "Burkina Faso" },
  { name: "Koudougou", country: "Burkina Faso" },
  { name: "Banfora", country: "Burkina Faso" },
  { name: "Ouahigouya", country: "Burkina Faso" },
];

const inputClass =
  "mt-1.5 h-12 w-full border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#111] outline-none transition-colors placeholder:text-[#999] focus:border-[#111]";

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
      const res = await fetch(
        `${(import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "")}/api/payments/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId: import.meta.env.VITE_STORE_ID_TECH,
            items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            customer: { name: form.name, phone: form.phone, email: form.email },
            shippingAddress: {
              street: form.address,
              city: form.city,
              country: CITIES.find((c) => c.name === form.city)?.country || "Togo",
            },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la commande");
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
      <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="px-4 text-center">
            <p className="text-[14px] text-[#999]">Panier vide.</p>
            <Link
              to="/catalogue"
              className="mt-4 inline-block text-[13px] font-medium underline underline-offset-4 text-[#555] hover:text-[#111]"
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
        <div className="mx-auto max-w-[560px] px-5 py-12 lg:py-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">Étape 2</p>
          <h1 className="mt-3 text-[36px] font-light tracking-tight lg:text-[44px]">Livraison</h1>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label className="text-[12px] text-[#555]">Nom complet</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[12px] text-[#555]">Téléphone</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+228 90 00 00 00"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[12px] text-[#555]">Email (optionnel)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[12px] text-[#555]">Adresse</label>
              <input
                required
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[12px] text-[#555]">Ville</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass}
              >
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.country})
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="border border-[#e5e5e5] bg-white px-4 py-3 text-[13px] text-[#111]">
                {error}
              </p>
            )}

            <div className="border-y border-[#e5e5e5] py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] text-[#555]">
                  Total ({items.length} article{items.length > 1 ? "s" : ""})
                </span>
                <span className="text-[22px] font-light tracking-tight">{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-[12px] text-[#999]">Paiement à la livraison</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111] py-4 text-[13px] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {loading ? "Traitement..." : `Confirmer — ${formatPrice(total)}`}
            </button>
          </form>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
