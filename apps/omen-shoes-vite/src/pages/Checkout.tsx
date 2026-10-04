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
  "Ouahigouya": "Burkina Faso",
  "Banfora": "Burkina Faso",
  "Dédougou": "Burkina Faso",
  "Kaya": "Burkina Faso",
  "Tenkodogo": "Burkina Faso",
  "Fada N'Gourma": "Burkina Faso",
  "Korhogo": "Burkina Faso",
};

const API_BASE = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
const PAY_NUMBER = "65343241";
const MOOV_NUMBER = "63213029";

type PayMethod = "ORANGE_MONEY" | "MOOV_MONEY";

export default function Checkout() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clearCart = useCart((s) => s.clearCart);
  const addOrder = useAuth((s) => s.addOrder);
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

  // Code promo influenceur
  const [codeInput, setCodeInput] = useState("");
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [discountPct, setDiscountPct] = useState(0);

  const finalTotal = Math.max(0, total - discount);

  // Articles sur commande : 50% à la commande, solde à la livraison
  const preorderSum = items.reduce((sum, i) => (i.preorder ? sum + i.price * i.quantity : sum), 0);
  const preorderShare = preorderSum > 0 && total > 0 ? preorderSum - Math.round((discount * preorderSum) / total) : 0;
  const dueAtDelivery = Math.floor(preorderShare / 2);
  const dueNow = Math.max(0, finalTotal - dueAtDelivery);
  const hasPreorder = dueAtDelivery > 0;

  const applyCode = async () => {
    const c = codeInput.trim().toUpperCase();
    if (!c) return;
    setCodeChecking(true);
    setCodeError(null);
    try {
      const res = await fetch(`${API_BASE}/api/partners/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: import.meta.env.VITE_STORE_ID_SHOES,
          code: c,
          subtotal: total,
        }),
      });
      const data = await res.json();
      if (!data.valid) {
        setCodeError(data.error || "Code invalide");
        setAppliedCode(null);
        setDiscount(0);
        setDiscountPct(0);
      } else {
        setAppliedCode(c);
        setDiscount(data.discount || 0);
        setDiscountPct(data.discountPct || 0);
        setCodeInput("");
      }
    } catch {
      setCodeError("Vérification impossible — réessaie");
    } finally {
      setCodeChecking(false);
    }
  };

  const removeCode = () => {
    setAppliedCode(null);
    setDiscount(0);
    setDiscountPct(0);
    setCodeError(null);
  };

  const omUssd = `*144*2*1*${PAY_NUMBER}*${dueNow}#`;
  const moovUssd = `*555*2*1*${MOOV_NUMBER}*${dueNow}#`;

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
          storeId: import.meta.env.VITE_STORE_ID_SHOES,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: { name: form.name, phone: form.phone, email: form.email },
          shippingAddress: {
            street: form.address,
            city: form.city,
            country: CITY_COUNTRY[form.city] ?? "Burkina Faso",
            heure: form.heure,
            position: form.position,
            proof: proofUrl,
          },
          paymentMethod: payMethod,
          couponCode: appliedCode || undefined,
          notes: `Heure: ${form.heure} - Position: ${form.position || "non renseignee"} - Preuve: ${proofUrl}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur commande");
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
        total: finalTotal,
        city: form.city,
        status: "confirmee",
        paymentMethod: payMethod || "COD",
      });
      clearCart();
      window.location.href = `/order-success?ref=${data.reference || data.orderId}`;
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
                <input type="tel" required placeholder="+226 70 12 34 56" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]" />
                <input type="email" placeholder="Email (optionnel)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]" />
              </div>
            </div>

            <div className="space-y-3 rounded-xl bg-white p-4 sm:space-y-4 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
              <h2 className="text-[13px] font-bold text-[#111] sm:text-sm">Livraison</h2>
              <input type="text" required placeholder="Adresse — rue, quartier, repère" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]" />
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111]">
                {Object.keys(CITY_COUNTRY).map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={form.heure} onChange={(e) => setForm({ ...form, heure: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111]">
                <option>Dès que possible</option>
                <option>Matin (8h – 12h)</option>
                <option>Après-midi (12h – 17h)</option>
                <option>Soir (17h – 21h)</option>
              </select>
              <div className="flex gap-2">
                <input type="text" required placeholder="Position exacte (quartier, repère, lien Maps)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]" />
                <button type="button" onClick={locate} className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-[#1d4ed8] px-4 text-[12px] font-semibold text-[#1d4ed8] transition-colors hover:bg-[#1d4ed8] hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  Position
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-xl bg-white p-4 sm:space-y-4 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-bold text-[#111] sm:text-sm">Mode de paiement</h2>
                <span className="text-right">
                  <span className="text-[15px] font-black text-[#111]">{dueNow.toLocaleString("fr-FR")} FCFA</span>
                  {hasPreorder && (
                    <span className="block text-[10.5px] font-bold text-orange-600">à payer maintenant</span>
                  )}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPayMethod("ORANGE_MONEY")}
                  className={`rounded-lg p-4 text-left transition-colors ${payMethod === "ORANGE_MONEY" ? "border-2 border-[#1d4ed8] bg-blue-50/50" : "border border-[#e0d6d0] hover:border-[#999]"}`}
                >
                  <img src="/img/orange-money.svg" alt="Orange Money" className="h-7 w-auto" />
                  <p className="mt-3 text-[13px] font-bold text-[#111]">Orange Money</p>
                  <p className="mt-1 break-all text-[11px] leading-[1.55] text-[#999]">{omUssd}</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("MOOV_MONEY")}
                  className={`rounded-lg p-4 text-left transition-colors ${payMethod === "MOOV_MONEY" ? "border-2 border-[#1d4ed8] bg-blue-50/50" : "border border-[#e0d6d0] hover:border-[#999]"}`}
                >
                  <img src="/img/moov-money.png" alt="Moov Money" className="h-7 w-auto" />
                  <p className="mt-3 text-[13px] font-bold text-[#111]">Moov Money</p>
                  <p className="mt-1 break-all text-[11px] leading-[1.55] text-[#999]">{moovUssd}</p>
                </button>
              </div>
              <a
                href={payMethod === "ORANGE_MONEY" ? `tel:${omUssd.replace("#", "%23")}` : payMethod === "MOOV_MONEY" ? `tel:${moovUssd.replace("#", "%23")}` : undefined}
                aria-disabled={payMethod ? undefined : true}
                className={`block w-full rounded-lg bg-[#1d4ed8] py-3.5 text-center text-[14px] font-semibold text-white active:scale-[0.98] sm:py-4 ${payMethod ? "" : "pointer-events-none opacity-40"}`}
              >
                {payMethod === "ORANGE_MONEY"
                  ? `Composer ${omUssd}`
                  : payMethod === "MOOV_MONEY"
                    ? `Composer ${moovUssd}`
                    : "Choisis un mode de paiement"}
              </a>
              <p className="text-[11px] leading-[1.6] text-[#999]">
                Ton téléphone compose le code USSD. Tu valides avec ton PIN, puis tu fais une capture d&rsquo;écran du
                succès de transaction.
                {hasPreorder && " Pour les articles sur commande, ce montant couvre les 50% — le solde sera encaissé à la livraison."}
              </p>
            </div>

            <div className="space-y-3 rounded-xl bg-white p-4 sm:space-y-4 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
              <h2 className="text-[13px] font-bold text-[#111] sm:text-sm">Preuve de paiement</h2>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadProof(f);
                }}
                className="block w-full text-[12px] text-[#666] file:mr-3 file:rounded-lg file:border file:border-[#e0d6d0] file:bg-white file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-[#1d4ed8] hover:file:border-[#1d4ed8]"
              />
              {proofUploading && <p className="text-[11px] text-[#999]">Envoi en cours…</p>}
              {proofError && <p className="text-[11px] text-red-600">{proofError}</p>}
              {proofUrl && (
                <div className="rounded-lg border border-[#e0d6d0] p-3">
                  <img src={proofUrl} alt="Preuve de paiement" className="max-h-56 w-full object-contain" />
                  <p className="mt-2 break-all text-[10.5px] text-[#999]">Preuve envoyée</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white p-4 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
              <h2 className="mb-2 text-[13px] font-bold text-[#111] sm:mb-3 sm:text-sm">Récapitulatif</h2>
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}`} className="flex justify-between text-[12px] text-[#666] py-0.5 sm:text-[13px]">
                  <span className="truncate">
                    {i.name} ({i.size}) × {i.quantity}
                    {i.preorder && <span className="ml-1 font-semibold text-orange-600">· sur commande</span>}
                  </span>
                  <span className="shrink-0 pl-2 font-medium text-[#111]">{(i.price * i.quantity).toLocaleString("fr-FR")} FCFA</span>
                </div>
              ))}

              {/* Code promo influenceur */}
              {appliedCode ? (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-[#1d4ed8] bg-blue-50/50 px-3 py-2.5">
                  <span className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-[#1d4ed8]">
                    {appliedCode} · -{discountPct}%
                  </span>
                  <button type="button" onClick={removeCode} className="text-[11px] text-[#999] transition-colors hover:text-red-600">
                    Retirer
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Code promo influenceur"
                    className="input h-10 min-w-0 flex-1 rounded-lg px-3 text-[13px] uppercase tracking-[0.1em] text-[#111] placeholder:normal-case placeholder:tracking-normal placeholder:text-[#999]"
                  />
                  <button
                    type="button"
                    onClick={applyCode}
                    disabled={codeChecking || !codeInput.trim()}
                    className="h-10 shrink-0 rounded-lg border border-[#1d4ed8] px-4 text-[12px] font-semibold text-[#1d4ed8] transition-colors hover:bg-[#1d4ed8] hover:text-white disabled:opacity-40"
                  >
                    {codeChecking ? "…" : "Appliquer"}
                  </button>
                </div>
              )}
              {codeError && !appliedCode && <p className="mt-1.5 text-[11px] text-red-600">{codeError}</p>}
              {appliedCode && discount > 0 && (
                <div className="mt-2 flex justify-between text-[12px] text-[#16a34a] sm:text-[13px]">
                  <span>Réduction ({appliedCode})</span>
                  <span className="font-medium">- {discount.toLocaleString("fr-FR")} FCFA</span>
                </div>
              )}

              {hasPreorder && (
                <div className="mt-3 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2.5 text-[12px] leading-relaxed text-orange-800 sm:text-[12.5px]">
                  <p className="font-bold">Articles sur commande : 50% à la commande</p>
                  <p className="mt-1">À payer maintenant : <b>{dueNow.toLocaleString("fr-FR")} FCFA</b></p>
                  <p>À régler à la livraison : <b>{dueAtDelivery.toLocaleString("fr-FR")} FCFA</b></p>
                </div>
              )}

              <div className="mt-2 pt-2 flex items-center justify-between sm:mt-3 sm:pt-3" style={{ borderTop: "1px solid #e0d6d0" }}><span className="text-[13px] font-bold text-[#111] sm:text-sm">{hasPreorder ? "Total commande" : "Total"}</span><span className="text-lg font-black text-[#111]">{finalTotal.toLocaleString("fr-FR")} FCFA</span></div>
            </div>

            {error && <div className="rounded-lg bg-red-50 p-3 text-[12px] text-red-600 sm:text-[13px]">{error}</div>}

            <button type="submit" disabled={loading || !canSubmit} className="w-full rounded-lg bg-[#1d4ed8] py-3.5 text-[14px] font-semibold text-white active:scale-[0.98] disabled:opacity-50 sm:py-4">
              {loading ? "Redirection..." : `Confirmer — ${dueNow.toLocaleString("fr-FR")} FCFA`}
            </button>
            <p className="text-center text-[10px] text-[#999] sm:text-[11px]">Orange Money / Moov Money — capture requise</p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
