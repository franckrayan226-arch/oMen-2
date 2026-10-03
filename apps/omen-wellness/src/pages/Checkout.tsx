import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/hooks/useCart";

const CITIES = [
  "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora",
  "Dédougou", "Kaya", "Tenkodogo", "Fada N'Gourma", "Korhogo",
];

const API_BASE = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
const PAY_NUMBER = "65343241";
const MOOV_NUMBER = "63213029";

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

  const omUssd = `*144*2*1*${PAY_NUMBER}*${total}#`;
  const moovUssd = `*555*2*1*${MOOV_NUMBER}*${total}#`;

  const locate = () => {
    if (!navigator.geolocation) {
      setError("Géolocalisation indisponible — colle un lien Google Maps");
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
      () => setError("Autorise la géolocalisation ou colle un lien Google Maps")
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
          storeId: import.meta.env.VITE_STORE_ID_WELLNESS,
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
      if (!res.ok) throw new Error(data.error || "Erreur commande");
      clearCart();
      window.location.href = `/order-success?ref=${data.reference || data.orderId}`;
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
                  <input type="tel" required placeholder="+226 70 12 34 56" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]" />
                  <input type="email" placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]" />
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <h2 className="label-mono text-[9px] text-[#17211a]/60">Livraison</h2>
              <div className="mt-4 space-y-2.5">
                <input type="text" required placeholder="Adresse — rue, quartier, repère" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]" />
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]">
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <select value={form.heure} onChange={(e) => setForm({ ...form, heure: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]">
                  <option>Dès que possible</option>
                  <option>Matin (8h – 12h)</option>
                  <option>Après-midi (12h – 17h)</option>
                  <option>Soir (17h – 21h)</option>
                </select>
                <div className="flex gap-2">
                  <input type="text" required placeholder="Position exacte (quartier, repère, lien Maps)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="glass-input h-11 w-full rounded-full px-4 text-[12px]" />
                  <button type="button" onClick={locate} className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-[#17211a]/25 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#17211a] transition-colors hover:bg-[#17211a] hover:text-[#f4efe3]">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    Position
                  </button>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="label-mono text-[9px] text-[#17211a]/60">Mode de paiement</h2>
                <span className="text-[13px] font-bold text-[#17211a]">{total.toLocaleString("fr-FR")} FCFA</span>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPayMethod("ORANGE_MONEY")}
                  className={`rounded-3xl border p-4 text-left transition-colors ${
                    payMethod === "ORANGE_MONEY" ? "border-[#b4552d] bg-[#b4552d]/8" : "border-[#17211a]/12 bg-white/60 hover:border-[#17211a]/35"
                  }`}
                >
                  <img src="/img/orange-money.svg" alt="Orange Money" className="h-7 w-auto" />
                  <p className="mt-3 text-[12.5px] font-bold text-[#17211a]">Orange Money</p>
                  <p className="mt-1 break-all text-[10.5px] leading-[1.55] text-[#17211a]/55">{omUssd}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("MOOV_MONEY")}
                  className={`rounded-3xl border p-4 text-left transition-colors ${
                    payMethod === "MOOV_MONEY" ? "border-[#b4552d] bg-[#b4552d]/8" : "border-[#17211a]/12 bg-white/60 hover:border-[#17211a]/35"
                  }`}
                >
                  <img src="/img/moov-money.png" alt="Moov Money" className="h-7 w-auto" />
                  <p className="mt-3 text-[12.5px] font-bold text-[#17211a]">Moov Money</p>
                  <p className="mt-1 break-all text-[10.5px] leading-[1.55] text-[#17211a]/55">{moovUssd}</p>
                </button>
              </div>

              <a
                href={payMethod === "ORANGE_MONEY" ? `tel:${omUssd.replace("#", "%23")}` : payMethod === "MOOV_MONEY" ? `tel:${moovUssd.replace("#", "%23")}` : undefined}
                aria-disabled={payMethod ? undefined : true}
                className={`btn-terra mt-3 block w-full rounded-full py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] ${payMethod ? "" : "pointer-events-none opacity-40"}`}
              >
                {payMethod === "ORANGE_MONEY"
                  ? `Composer ${omUssd}`
                  : payMethod === "MOOV_MONEY"
                    ? `Composer ${moovUssd}`
                    : "Choisis un mode de paiement"}
              </a>
              <p className="mt-2.5 text-center text-[10px] leading-[1.6] text-[#17211a]/50">
                Ton téléphone compose le code USSD. Tu valides avec ton PIN, puis tu fais une capture d&rsquo;écran
                du succès de transaction.
              </p>
            </div>

            <div className="glass rounded-3xl p-5">
              <h2 className="label-mono text-[9px] text-[#17211a]/60">Preuve de paiement</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadProof(f);
                }}
                className="mt-4 block w-full text-[11.5px] text-[#17211a]/70 file:mr-3 file:rounded-full file:border file:border-[#17211a]/20 file:bg-white file:px-4 file:py-2 file:text-[10px] file:font-semibold file:uppercase file:tracking-[0.14em] file:text-[#17211a] hover:file:border-[#17211a]"
              />
              {proofUploading && <p className="mt-2 text-[10.5px] text-[#17211a]/55">Envoi en cours…</p>}
              {proofError && <p className="mt-2 text-[10.5px] text-[#b4552d]">{proofError}</p>}
              {proofUrl && (
                <div className="mt-3 rounded-2xl border border-[#17211a]/12 bg-white/70 p-3">
                  <img src={proofUrl} alt="Preuve de paiement" className="max-h-56 w-full object-contain" />
                  <p className="mt-2 break-all text-[10px] text-[#17211a]/50">Preuve envoyée</p>
                </div>
              )}
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

            <button type="submit" disabled={loading || !canSubmit} className="btn-terra w-full rounded-full py-4 text-[11px] font-semibold uppercase tracking-[0.18em] disabled:opacity-50">
              {loading ? "Redirection..." : `Confirmer — ${total.toLocaleString("fr-FR")} FCFA`}
            </button>
            <p className="text-center text-[9px] uppercase tracking-[0.2em] text-[#17211a]/45">Orange Money / Moov Money — capture requise</p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
