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
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-4 py-10">
      <div className="animate-fade-in-up w-full max-w-sm">
        <div className="card p-6 sm:p-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8]">
            oMen Admin
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-tight">Connexion</h1>
          <p className="mt-1 text-[14px] text-[#777]">
            Gérez vos 3 boutiques depuis votre téléphone.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="username" className="block text-[14px] font-semibold text-[#444]">
                Nom d&rsquo;utilisateur
              </label>
              <input
                id="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoFocus
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                className="input mt-2"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[14px] font-semibold text-[#444]">
                Mot de passe
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoComplete="current-password"
                  className="input pr-20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 flex min-h-[40px] -translate-y-1/2 items-center px-3 text-[13px] font-semibold text-[#1d4ed8]"
                >
                  {show ? "Cacher" : "Voir"}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || !user || !pass}
              className="btn btn-primary w-full"
              style={{ minHeight: 54 }}
            >
              {busy ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[13px] leading-relaxed text-[#999]">
          Identifiants par défaut :{" "}
          <span className="font-semibold text-[#555]">admin / omen2026</span>
        </p>
      </div>
    </div>
  );
}
