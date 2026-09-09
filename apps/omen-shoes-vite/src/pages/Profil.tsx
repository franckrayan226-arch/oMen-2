import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth, type OrderRecord, type PublicUser } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const STATUS_LABEL: Record<OrderRecord["status"], string> = {
  confirmee: "Confirmée",
  preparation: "En préparation",
  livree: "Livrée",
};

/* ─────────────────────────  Champs de formulaire  ───────────────────────── */

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  minLength,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#111]/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className={`glass-input h-12 w-full rounded-xl px-4 text-[14px] text-[#111] outline-none transition-shadow duration-300 focus:shadow-[0_0_0_3px_rgba(29,78,216,0.18)] placeholder:text-[#111]/35 ${error ? "shadow-[0_0_0_2px_rgba(220,38,38,0.4)]" : ""}`}
        style={{ transitionTimingFunction: EASE }}
      />
      {error && <span className="mt-1 block text-[11px] font-medium text-red-600">{error}</span>}
    </label>
  );
}

/* ─────────────────────────  Écran auth (login/register)  ───────────────────────── */

function AuthScreen() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const register = useAuth((s) => s.register);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ id: "", password: "", name: "", email: "", phone: "", city: "Lomé", address: "" });

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res =
      mode === "login"
        ? await login(form.id, form.password)
        : await register({
            name: form.name,
            email: form.email,
            phone: form.phone,
            city: form.city,
            address: form.address,
            password: form.password,
          });
    setLoading(false);
    if (res.ok) navigate("/profil");
    else setError(res.error);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
      {/* header */}
      <div className="text-center">
        <div className="glass mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ boxShadow: "0 12px 28px -12px rgba(17,24,39,0.25)" }}>
          <svg className="h-7 w-7 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-[24px] text-[#111] sm:text-[28px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>
          {mode === "login" ? "Content de te revoir." : "Rejoins Omen Sneaker."}
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#111]/55">
          {mode === "login"
            ? "Connecte-toi pour retrouver tes commandes et tes favoris."
            : "Un compte pour suivre tes commandes, garder tes favoris et commander plus vite."}{" "}
          <span className="font-medium text-[#111]/45">Pas obligé : tu peux aussi commander sans compte.</span>
        </p>
      </div>

      {/* toggle login/register — segmented control iOS */}
      <div className="glass mt-7 grid grid-cols-2 rounded-full p-1" role="tablist">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={`relative rounded-full py-2 text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${mode === m ? "bg-[#111] text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.4)]" : "text-[#111]/55 hover:text-[#111]"}`}
            style={{ transitionTimingFunction: SPRING }}
          >
            {m === "login" ? "Connexion" : "Inscription"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="glass mt-4 space-y-3.5 rounded-[22px] p-5 sm:p-6">
        {mode === "login" ? (
          <>
            <Field
              label="Email ou téléphone"
              type="text"
              value={form.id}
              onChange={(v) => setForm({ ...form, id: v })}
              placeholder="toi@email.com ou +228 90 00 00 00"
              autoComplete="username"
              required
            />
            <div className="relative">
              <Field
                label="Mot de passe"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-[34px] text-[11px] font-semibold uppercase tracking-wider text-[#111]/45 transition-colors hover:text-[#1d4ed8]"
                aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPass ? "Cacher" : "Voir"}
              </button>
            </div>
          </>
        ) : (
          <>
            <Field label="Nom complet" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Awa Mensah" autoComplete="name" required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="toi@email.com" autoComplete="email" required />
            <Field label="Téléphone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+228 90 12 34 56" autoComplete="tel" required />
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#111]/50">Ville</span>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="glass-input h-12 w-full rounded-xl px-3 text-[14px] text-[#111] outline-none"
                >
                  <option>Lomé</option><option>Kara</option><option>Sokodé</option><option>Kpalimé</option>
                  <option>Ouagadougou</option><option>Bobo-Dioulasso</option><option>Koudougou</option>
                </select>
              </label>
              <Field label="Adresse" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="Quartier, rue" autoComplete="street-address" />
            </div>
            <div className="relative">
              <Field
                label="Mot de passe"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
                placeholder="6 caractères minimum"
                autoComplete="new-password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-[34px] text-[11px] font-semibold uppercase tracking-wider text-[#111]/45 transition-colors hover:text-[#1d4ed8]"
                aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPass ? "Cacher" : "Voir"}
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-xl bg-red-50/90 px-3.5 py-2.5 text-[12px] font-medium text-red-600" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#111] py-3.5 text-[13px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          style={{ transitionTimingFunction: SPRING, boxShadow: "0 14px 28px -12px rgba(0,0,0,0.45)" }}
        >
          {loading ? "Un instant…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-[#111]/40">
          {mode === "login" ? (
            <>Pas encore de compte ?{" "}
              <button type="button" onClick={() => switchMode("register")} className="font-semibold text-[#1d4ed8] hover:underline">Inscris-toi</button>
            </>
          ) : (
            <>Déjà membre ?{" "}
              <button type="button" onClick={() => switchMode("login")} className="font-semibold text-[#1d4ed8] hover:underline">Connecte-toi</button>
            </>
          )}
          {" · "}
          <Link to="/confidentialite" className="font-semibold text-[#111]/45 hover:text-[#1d4ed8] hover:underline">Politique de confidentialité</Link>
        </p>
      </form>

      {/* réassurance */}
      <div className="mt-5 flex items-center justify-center gap-5 text-[10.5px] font-medium text-[#111]/40">
        <span className="inline-flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Mot de passe chiffré
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" /><path d="M12 8v4l3 3" strokeLinecap="round" /></svg>
          Données conservées
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────  Ligne de commande  ───────────────────────── */

function OrderRow({ order }: { order: OrderRecord }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left" style={{ transitionTimingFunction: SPRING }}>
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((it, i) => (
            <img key={i} src={it.image} alt="" className="h-11 w-11 rounded-lg object-cover ring-2 ring-white" loading="lazy" />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-bold tracking-tight text-[#111]">{order.id}</p>
            <span className="rounded-full bg-[#1d4ed8]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1d4ed8]">{STATUS_LABEL[order.status]}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#111]/45">{fmtDate(order.date)} · {order.items.length} article{order.items.length > 1 ? "s" : ""} · {order.city}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[13px] font-extrabold text-[#111]">{order.total.toLocaleString("fr-FR")} <span className="text-[9px] font-bold text-[#111]/45">F</span></p>
          <svg className={`ml-auto mt-0.5 h-3.5 w-3.5 text-[#111]/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`} style={{ transitionTimingFunction: SPRING }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </button>
      {open && (
        <div className="space-y-2 px-4 pb-4 pt-1" style={{ borderTop: "1px solid rgba(17,24,39,0.07)" }}>
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={it.image} alt="" className="h-9 w-9 rounded-md object-cover" loading="lazy" />
              <p className="min-w-0 flex-1 truncate text-[12px] text-[#111]/75">{it.name} <span className="text-[#111]/40">· {it.size} × {it.quantity}</span></p>
              <p className="shrink-0 text-[12px] font-semibold text-[#111]">{(it.price * it.quantity).toLocaleString("fr-FR")} F</p>
            </div>
          ))}
          <p className="pt-1 text-[10.5px] text-[#111]/40">Paiement : {order.paymentMethod}</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  Écran compte connecté  ───────────────────────── */

function AccountScreen({ user: session }: { user: PublicUser }) {
  const navigate = useNavigate();
  const ordersMap = useAuth((s) => s.orders);
  const orders = useMemo(() => ordersMap[session.email] ?? [], [ordersMap, session.email]);
  const logout = useAuth((s) => s.logout);
  const updateProfile = useAuth((s) => s.updateProfile);
  const changePassword = useAuth((s) => s.changePassword);
  const cartItems = useCart((s) => s.items);
  const favItems = useFavorites((s) => s.items);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: session.name, phone: session.phone, city: session.city, address: session.address });
  const [savedFlash, setSavedFlash] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", next: "" });
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (savedFlash) {
      const t = setTimeout(() => setSavedFlash(false), 2200);
      return () => clearTimeout(t);
    }
  }, [savedFlash]);

  const saveProfile = () => {
    if (!editForm.name.trim()) return;
    updateProfile({
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      city: editForm.city,
      address: editForm.address.trim(),
    });
    setEditing(false);
    setSavedFlash(true);
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changePassword(passForm.current, passForm.next);
    setPassMsg(res.ok ? { ok: true, text: "Mot de passe mis à jour." } : { ok: false, text: res.error });
    if (res.ok) {
      setPassForm({ current: "", next: "" });
      setTimeout(() => { setPassOpen(false); setPassMsg(null); }, 1400);
    }
  };

  const initials = session.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const spent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* ── Identité ── */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#111] text-[20px] font-black tracking-tight text-white sm:h-18 sm:w-18"
          style={{ boxShadow: "0 16px 32px -14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)" }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[20px] text-[#111] sm:text-[24px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>{session.name}</h1>
          <p className="truncate text-[12px] text-[#111]/50">{session.email} · {session.city}</p>
        </div>
        <button
          onClick={() => { logout(); navigate("/profil"); }}
          className="glass-chip shrink-0 rounded-full px-3.5 py-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#111]/70 transition-all duration-300 hover:scale-105 hover:text-red-600 active:scale-95"
          style={{ transitionTimingFunction: SPRING }}
        >
          Déconnexion
        </button>
      </div>

      {/* flash de sauvegarde */}
      <div className={`overflow-hidden transition-all duration-500 ${savedFlash ? "mt-3 max-h-10 opacity-100" : "max-h-0 opacity-0"}`} style={{ transitionTimingFunction: EASE }}>
        <div className="rounded-xl bg-emerald-50 px-4 py-2.5 text-[12px] font-medium text-emerald-700">Profil mis à jour.</div>
      </div>

      {/* ── Stats rapides ── */}
      <div className="mt-6 grid grid-cols-3 gap-2.5">
        {[
          { value: orders.length, label: "Commandes", href: null },
          { value: cartItems.reduce((s, i) => s + i.quantity, 0), label: "Panier", href: "/panier" },
          { value: favItems.length, label: "Favoris", href: "/favoris" },
        ].map((s) => {
          const inner = (
            <div className="glass rounded-2xl px-3 py-4 text-center transition-transform duration-300 hover:-translate-y-0.5" style={{ transitionTimingFunction: SPRING }}>
              <p className="text-[20px] font-black tracking-tight text-[#111]">{s.value}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#111]/45">{s.label}</p>
            </div>
          );
          return s.href ? <Link key={s.label} to={s.href} className="block">{inner}</Link> : <div key={s.label}>{inner}</div>;
        })}
      </div>

      {/* ── Commandes ── */}
      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] text-[#111] sm:text-[18px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Mes commandes</h2>
          {orders.length > 0 && <p className="text-[11px] text-[#111]/40">{spent.toLocaleString("fr-FR")} F dépensés</p>}
        </div>
        {orders.length === 0 ? (
          <div className="glass mt-3 flex flex-col items-center rounded-2xl px-6 py-8 text-center">
            <svg className="h-8 w-8 text-[#111]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 20a2 2 0 100-4 2 2 0 000 4zm14 0a2 2 0 100-4 2 2 0 000 4z" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p className="mt-3 text-[13px] font-medium text-[#111]/60">Aucune commande pour l'instant.</p>
            <Link to="/catalogue" className="mt-4 rounded-full bg-[#111] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-transform active:scale-95" style={{ transitionTimingFunction: SPRING }}>
              Explorer le catalogue
            </Link>
          </div>
        ) : (
          <div className="mt-3 space-y-2.5">{orders.map((o) => <OrderRow key={o.id} order={o} />)}</div>
        )}
      </section>

      {/* ── Informations personnelles ── */}
      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] text-[#111] sm:text-[18px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Mes informations</h2>
          <button
            onClick={() => { if (editing) setEditForm({ name: session.name, phone: session.phone, city: session.city, address: session.address }); setEditing(!editing); }}
            className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1d4ed8] transition-opacity hover:opacity-70"
          >
            {editing ? "Annuler" : "Modifier"}
          </button>
        </div>
        <div className="glass mt-3 rounded-[22px] p-5">
          {editing ? (
            <div className="space-y-3.5">
              <Field label="Nom complet" value={editForm.name} onChange={(v) => setEditForm({ ...editForm, name: v })} autoComplete="name" />
              <Field label="Téléphone" type="tel" value={editForm.phone} onChange={(v) => setEditForm({ ...editForm, phone: v })} autoComplete="tel" />
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#111]/50">Ville</span>
                  <select value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} className="glass-input h-12 w-full rounded-xl px-3 text-[14px] text-[#111] outline-none">
                    <option>Lomé</option><option>Kara</option><option>Sokodé</option><option>Kpalimé</option>
                    <option>Ouagadougou</option><option>Bobo-Dioulasso</option><option>Koudougou</option>
                  </select>
                </label>
                <Field label="Adresse" value={editForm.address} onChange={(v) => setEditForm({ ...editForm, address: v })} autoComplete="street-address" />
              </div>
              <button
                onClick={saveProfile}
                className="w-full rounded-full bg-[#111] py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-all active:scale-[0.98]"
                style={{ transitionTimingFunction: SPRING }}
              >
                Enregistrer
              </button>
            </div>
          ) : (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {[
                ["Nom", session.name],
                ["Email", session.email],
                ["Téléphone", session.phone || "—"],
                ["Ville", session.city],
                ["Adresse", session.address || "—"],
                ["Membre depuis", fmtDate(session.createdAt)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#111]/40">{k}</dt>
                  <dd className="mt-0.5 truncate text-[13.5px] font-medium text-[#111]">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* ── Sécurité ── */}
      <section className="mt-7">
        <h2 className="text-[16px] text-[#111] sm:text-[18px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Sécurité</h2>
        <div className="glass mt-3 rounded-[22px] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-[#111]">Mot de passe</p>
              <p className="mt-0.5 text-[11.5px] text-[#111]/45">Chiffré (SHA-256), jamais stocké en clair.</p>
            </div>
            <button
              onClick={() => setPassOpen(!passOpen)}
              className="glass-chip shrink-0 rounded-full px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#111]/75 transition-all hover:scale-105 active:scale-95"
              style={{ transitionTimingFunction: SPRING }}
            >
              {passOpen ? "Fermer" : "Changer"}
            </button>
          </div>
          <div className={`overflow-hidden transition-all duration-500 ${passOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"}`} style={{ transitionTimingFunction: EASE }}>
            <form onSubmit={submitPassword} className="space-y-3">
              <Field label="Mot de passe actuel" type="password" value={passForm.current} onChange={(v) => setPassForm({ ...passForm, current: v })} autoComplete="current-password" required />
              <Field label="Nouveau mot de passe" type="password" value={passForm.next} onChange={(v) => setPassForm({ ...passForm, next: v })} placeholder="6 caractères minimum" autoComplete="new-password" required minLength={6} />
              {passMsg && (
                <p className={`text-[12px] font-medium ${passMsg.ok ? "text-emerald-600" : "text-red-600"}`} role="alert">{passMsg.text}</p>
              )}
              <button type="submit" className="w-full rounded-full bg-[#111] py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-all active:scale-[0.98]" style={{ transitionTimingFunction: SPRING }}>
                Mettre à jour
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────  Page  ───────────────────────── */

export default function Profil() {
  // slices bruts (références stables) — la dérivation se fait en useMemo
  const sessionEmail = useAuth((s) => s.sessionEmail);
  const users = useAuth((s) => s.users);
  const session: PublicUser | null = useMemo(() => {
    const u = users.find((x) => x.email === sessionEmail);
    if (!u) return null;
    const { passHash: _ph, ...pub } = u;
    return pub;
  }, [users, sessionEmail]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{session && sessionEmail ? <AccountScreen user={session} /> : <AuthScreen />}</main>
      <Footer />
      <MobileNav />
      <div className="h-20 sm:hidden" />
    </div>
  );
}
