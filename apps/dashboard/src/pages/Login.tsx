import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(user.trim(), pass);
    } catch (err: any) {
      setError(err.message || "Connexion impossible");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "radial-gradient(60% 80% at 20% 10%, #eef1f6 0%, #f6f5f3 55%)" }}>
      <div className="animate-fade-in-up w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_24px_60px_-24px_rgba(17,24,39,0.25)] ring-1 ring-black/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1d4ed8]">Omen Admin</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-[12.5px] text-[#666]">Omen Sneaker &amp; Omen Wellness — gestion centralisée.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#444]">Identifiant</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoFocus
              autoComplete="username"
              className="mt-1 w-full rounded-xl border border-black/10 bg-[#fafafa] px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#1d4ed8] focus:bg-white"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide text-[#444]">Mot de passe</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-black/10 bg-[#fafafa] px-3.5 py-2.5 pr-16 text-[14px] outline-none transition focus:border-[#1d4ed8] focus:bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#1d4ed8] hover:bg-blue-50"
              >
                {show ? "Cacher" : "Voir"}
              </button>
            </div>
          </div>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12.5px] text-red-600 ring-1 ring-red-100">{error}</p>}

          <button
            type="submit"
            disabled={busy || !user || !pass}
            className="w-full rounded-xl bg-[#111] py-3 text-[13.5px] font-semibold text-white transition hover:bg-black active:scale-[0.98] disabled:opacity-50"
          >
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-5 border-t border-black/5 pt-4 text-[11px] leading-relaxed text-[#999]">
          Par défaut : <span className="font-semibold text-[#555]">admin / omen2026</span> — pense à le changer dans <code>server/server.mjs</code>.
        </p>
      </div>
    </div>
  );
}
