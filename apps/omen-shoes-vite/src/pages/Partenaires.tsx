import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const API_BASE = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
const STORE_ID = import.meta.env.VITE_STORE_ID_SHOES || "omen-shoes";

type Partner = { code: string; name: string };

export default function Partenaires() {
  const [cfg, setCfg] = useState<{ discountPct: number; commissionPct: number } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", handle: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/partners/config?storeId=${STORE_ID}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.discountPct === "number") setCfg(d);
      })
      .catch(() => {});
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/partners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: STORE_ID, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Inscription impossible");
      setPartner({ code: data.code, name: data.name });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!partner) return;
    try {
      await navigator.clipboard.writeText(partner.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareText = partner
    ? `Mon code oMen Sneaker ${partner.code} — ${cfg ? `-${cfg.discountPct}% ` : ""}sur omen.shop ! Utilise-le à la caisse.`
    : "";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-3 py-8 sm:px-6 sm:py-14">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1d4ed8] sm:text-[10px]">
            Omen Sneaker Partners
          </p>
          <h1 className="mt-2 text-[26px] font-black text-[#111] sm:text-[38px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>
            Devenez influenceur
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-[#666] sm:text-[14px]">
            Partagez vos sneakers préférées avec votre communauté. Vos abonnés paient moins grâce à
            votre code, et vous touchez une commission sur chaque vente.
          </p>

          {/* Comment ça marche */}
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { n: "1", t: "Inscrivez-vous", d: "Nom, téléphone et votre compte Instagram ou TikTok." },
              { n: "2", t: "Recevez votre code", d: "Un code unique est généré, actif immédiatement." },
              {
                n: "3",
                t: "Partagez & gagnez",
                d: cfg
                  ? `-${cfg.discountPct}% pour votre communauté, ${cfg.commissionPct}% de commission pour vous.`
                  : "Votre communauté paie moins, vous gagnez de l'argent.",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-xl bg-white p-4" style={{ border: "1px solid #e0d6d0" }}>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1d4ed8] text-[12px] font-bold text-white">
                  {s.n}
                </span>
                <p className="mt-3 text-[13px] font-bold text-[#111]">{s.t}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#999]">{s.d}</p>
              </div>
            ))}
          </div>

          {partner ? (
            /* ── Code généré ── */
            <div className="mt-7 rounded-xl bg-white p-6 text-center sm:p-9" style={{ border: "1px solid #e0d6d0" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1d4ed8]">
                Bienvenue {partner.name.split(" ")[0]} — votre code
              </p>
              <p
                className="mt-4 select-all text-[42px] font-black tracking-[0.12em] text-[#111] sm:text-[58px]"
                style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}
              >
                {partner.code}
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <button
                  onClick={copyCode}
                  className="w-full rounded-lg bg-[#1d4ed8] px-6 py-3 text-[13px] font-semibold text-white active:scale-[0.98] sm:w-auto"
                >
                  {copied ? "Code copié !" : "Copier le code"}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-lg border border-[#1d4ed8] px-6 py-3 text-[13px] font-semibold text-[#1d4ed8] transition-colors hover:bg-[#1d4ed8] hover:text-white sm:w-auto"
                >
                  Partager sur WhatsApp
                </a>
              </div>
              <div className="mx-auto mt-6 max-w-md space-y-1.5 text-left text-[11.5px] leading-relaxed text-[#666]">
                <p>· Vos abonnés saisissent ce code au checkout : {cfg ? `- ${cfg.discountPct} %` : "réduction"} sur leur panier.</p>
                <p>· Vous recevez {cfg ? `${cfg.commissionPct} %` : "une commission"} de commission sur chaque vente.</p>
                <p>· Chaque vente apparaît dans le tableau de bord de la boutique.</p>
              </div>
              <Link to="/" className="mt-6 inline-block text-[12px] font-semibold text-[#1d4ed8]">
                &larr; Retour à la boutique
              </Link>
            </div>
          ) : (
            /* ── Formulaire d'adhésion ── */
            <form onSubmit={submit} className="mt-7 space-y-3 rounded-xl bg-white p-4 sm:p-5" style={{ border: "1px solid #e0d6d0" }}>
              <h2 className="text-[13px] font-bold text-[#111] sm:text-sm">Rejoindre le programme</h2>
              <input
                type="text"
                required
                placeholder="Nom complet"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]"
              />
              <input
                type="tel"
                required
                placeholder="+226 70 12 34 56"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]"
              />
              <input
                type="text"
                placeholder="Instagram ou TikTok (@votrecompte)"
                value={form.handle}
                onChange={(e) => setForm({ ...form, handle: e.target.value })}
                className="input h-11 w-full rounded-lg px-4 text-[14px] text-[#111] placeholder:text-[#999]"
              />
              {error && <p className="rounded-lg bg-red-50 p-3 text-[12px] text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !form.name.trim() || !form.phone.trim()}
                className="w-full rounded-lg bg-[#1d4ed8] py-3.5 text-[14px] font-semibold text-white active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Génération du code…" : "Recevoir mon code unique"}
              </button>
              <p className="text-center text-[10px] text-[#999]">Gratuit — actif immédiatement</p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
