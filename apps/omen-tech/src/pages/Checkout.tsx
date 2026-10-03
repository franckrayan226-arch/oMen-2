import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

const CITIES: { name: string; country: string }[] = [
  { name: "Ouagadougou", country: "Burkina Faso" },
  { name: "Bobo-Dioulasso", country: "Burkina Faso" },
  { name: "Koudougou", country: "Burkina Faso" },
  { name: "Ouahigouya", country: "Burkina Faso" },
  { name: "Banfora", country: "Burkina Faso" },
  { name: "Dédougou", country: "Burkina Faso" },
  { name: "Kaya", country: "Burkina Faso" },
  { name: "Tenkodogo", country: "Burkina Faso" },
  { name: "Fada N'Gourma", country: "Burkina Faso" },
  { name: "Korhogo", country: "Burkina Faso" },
];

const PAY_NUMBER = "65343241";
const MOOV_NUMBER = "63213029";
const API_BASE = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");

const inputClass =
  "mt-1.5 h-12 w-full border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#111] outline-none transition-colors placeholder:text-[#999] focus:border-[#111]";

type PayMethod = "ORANGE_MONEY" | "MOOV_MONEY";

export default function Checkout() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clearCart = useCart((s) => s.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Ouagadougou",
    heure: "Dès que possible",
    position: "",
  });
  const [payMethod, setPayMethod] = useState<PayMethod | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);

  const omUssd = `*1441*2*1*${PAY_NUMBER}*${total}#`;
  const moovUssd = `*55*2*1*${MOOV_NUMBER}*${total}#`;

  const locate = () => {
    if (!navigator.geolocation) {
      setProofError(null);
      setForm({ ...form, position: form.position || "" });
      setError("Geolocalisation indisponible — colle un lien Google Maps");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setError(null);
        setForm((f) => ({
          ...f,
          position: `https://maps.google.com/?q=${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`,
        }));
      },
      () => setError("Autorise la geolocalisation ou colle un lien Google Maps")
    );
  };

  const uploadProof = async (file: File) => {
    setProofUploading(true);
    setProofError(null);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", body: fd });
      const data = await res.json();
      const url = data.urls?.[0];
      if (!url) throw new Error(data.error || "Envoi de la capture impossible");
      setProofUrl(url.startsWith("http") ? url : `${API_BASE}${url}`);
    } catch (err: any) {
      setProofError(err.message || "Envoi de la capture impossible");
    } finally {
      setProofUploading(false);
    }
  };

  const canSubmit = !!payMethod && !!proofUrl && !proofUploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || !canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: import.meta.env.VITE_STORE_ID_TECH,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: { name: form.name, phone: form.phone, email: form.email },
          shippingAddress: {
            street: form.address,
            city: form.city,
            country: "Burkina Faso",
            heure: form.heure,
            position: form.position,
            proof: proofUrl,
          },
          paymentMethod: payMethod,
          notes: `Heure: ${form.heure} - Position: ${form.position || "non renseignee"} - Preuve: ${proofUrl}`,
        }),
      });
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
          <h1 className="mt-3 text-[34px] font-bold uppercase tracking-[-0.02em] lg:text-[44px]">Commande</h1>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <section>
              <p className="border-b border-[#e5e5e5] pb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">
                Livraison
              </p>
              <div className="mt-5 space-y-5">
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
                    placeholder="+226 70 00 00 00"
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
                    placeholder="Rue, quartier, repère"
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
                <div>
                  <label className="text-[12px] text-[#555]">Heure de livraison</label>
                  <select
                    value={form.heure}
                    onChange={(e) => setForm({ ...form, heure: e.target.value })}
                    className={inputClass}
                  >
                    <option>Dès que possible</option>
                    <option>Matin (8h – 12h)</option>
                    <option>Après-midi (12h – 17h)</option>
                    <option>Soir (17h – 21h)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] text-[#555]">Position exacte</label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      required
                      type="text"
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      placeholder="Quartier, repère ou lien Google Maps"
                      className="h-12 w-full border border-[#e5e5e5] bg-white px-4 text-[14px] text-[#111] outline-none transition-colors placeholder:text-[#999] focus:border-[#111]"
                    />
                    <button
                      type="button"
                      onClick={locate}
                      className="flex h-12 shrink-0 items-center gap-1.5 border border-[#111] px-3 text-[12px] font-medium text-[#111] transition-colors hover:bg-[#111] hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      Ma position
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <p className="border-b border-[#e5e5e5] pb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">
                Paiement — {formatPrice(total)}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPayMethod("ORANGE_MONEY")}
                  className={`border bg-white p-4 text-left transition-colors ${
                    payMethod === "ORANGE_MONEY" ? "border-[#111]" : "border-[#e5e5e5] hover:border-[#999]"
                  }`}
                >
                  <img src="/img/orange-money.svg" alt="Orange Money" className="h-7 w-auto" />
                  <p className="mt-3 text-[13px] font-medium text-[#111]">Orange Money</p>
                  <p className="mt-1 break-all text-[11px] leading-[1.5] text-[#999]">{omUssd}</p>
                  <span className="mt-3 inline-flex items-center border border-[#111] px-3 py-2 text-[12px] font-medium text-[#111]">
                    Sélectionner
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod("MOOV_MONEY")}
                  className={`border bg-white p-4 text-left transition-colors ${
                    payMethod === "MOOV_MONEY" ? "border-[#111]" : "border-[#e5e5e5] hover:border-[#999]"
                  }`}
                >
                  <img src="/img/moov-money.png" alt="Moov Money" className="h-7 w-auto" />
                  <p className="mt-3 text-[13px] font-medium text-[#111]">Moov Money</p>
                  <p className="mt-1 break-all text-[11px] leading-[1.5] text-[#999]">{moovUssd}</p>
                  <span className="mt-3 inline-flex items-center border border-[#111] px-3 py-2 text-[12px] font-medium text-[#111]">
                    Sélectionner
                  </span>
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a
                  href={payMethod === "ORANGE_MONEY" ? `tel:${omUssd.replace("#", "%23")}` : payMethod === "MOOV_MONEY" ? `tel:${moovUssd.replace("#", "%23")}` : undefined}
                  aria-disabled={payMethod ? undefined : true}
                  className={`flex-1 bg-[#111] py-4 text-center text-[13px] font-medium text-white transition-opacity ${
                    payMethod ? "hover:opacity-80" : "pointer-events-none opacity-40"
                  }`}
                >
                  {payMethod === "ORANGE_MONEY"
                    ? `Composer ${omUssd}`
                    : payMethod === "MOOV_MONEY"
                      ? `Composer ${moovUssd}`
                      : "Choisis un mode de paiement"}
                </a>
              </div>
              <p className="mt-2 text-[12px] leading-[1.6] text-[#999]">
                Ton téléphone compose le code USSD. Tu valides avec ton PIN, puis tu fais une capture d'écran du
                succès de transaction.
              </p>
            </section>

            <section>
              <p className="border-b border-[#e5e5e5] pb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">
                Preuve de paiement
              </p>
              <div className="mt-5">
                <label className="text-[12px] text-[#555]">Capture de la confirmation SMS / écran</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadProof(f);
                  }}
                  className="mt-1.5 block w-full border border-[#e5e5e5] bg-white px-4 py-3 text-[13px] text-[#555] file:mr-4 file:border file:border-[#e5e5e5] file:bg-white file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-[#111] hover:file:border-[#111]"
                />
                {proofUploading && <p className="mt-2 text-[12px] text-[#999]">Envoi en cours…</p>}
                {proofError && <p className="mt-2 text-[12px] text-[#b00020]">{proofError}</p>}
                {proofUrl && (
                  <div className="mt-3 border border-[#e5e5e5] bg-white p-3">
                    <img src={proofUrl} alt="Preuve de paiement" className="max-h-56 w-full object-contain" />
                    <p className="mt-2 break-all text-[11px] text-[#999]">Preuve envoyée</p>
                  </div>
                )}
              </div>
            </section>

            {error && (
              <p className="border border-[#e5e5e5] bg-white px-4 py-3 text-[13px] text-[#111]">{error}</p>
            )}

            <div className="border-y border-[#e5e5e5] py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] text-[#555]">
                  Total ({items.length} article{items.length > 1 ? "s" : ""})
                </span>
                <span className="text-[22px] font-light tracking-tight">{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-[12px] text-[#999]">
                {payMethod === "ORANGE_MONEY"
                  ? "Orange Money — capture requise"
                  : payMethod === "MOOV_MONEY"
                    ? "Moov Money — capture requise"
                    : "Orange Money ou Moov Money — capture requise"}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !canSubmit}
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
