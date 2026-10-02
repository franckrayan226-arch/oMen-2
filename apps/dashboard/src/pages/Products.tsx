import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import type { ProductCard } from "@/types";
import { fmt } from "@/lib/format";

type Tab = "all" | "shoes" | "wellness" | "tech";

const SITE_LABEL: Record<string, string> = {
  shoes: "Sneaker",
  wellness: "Wellness",
  tech: "Tech",
};

export default function ProductsPage() {
  const [items, setItems] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    const base = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
    const resolveUrl = (u?: string) => (!u ? "" : u.startsWith("http") ? u : `${base}${u}`);
    api
      .products()
      .then((raw) => {
        const withSite = raw.map((p: any) => ({
          ...p,
          site:
            p.storeId === "omen-shoes"
              ? "shoes"
              : p.storeId === "omen-tech"
              ? "tech"
              : "wellness",
          image:
            resolveUrl(p.images?.[0]?.url) ||
            resolveUrl(p.colors?.[0]?.images?.[0]?.url) ||
            "",
          brand: p.brand || p.category || "",
          colorsCount: p.colors?.length || 0,
        }));
        setItems(withSite);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(
      (p) =>
        (tab === "all" || p.site === tab) &&
        (!s || p.name.toLowerCase().includes(s) || (p.brand || "").toLowerCase().includes(s))
    );
  }, [items, tab, q]);

  const remove = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setItems((xs) => xs.filter((x) => x.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setConfirmId(null);
  };

  const toggleActive = async (p: ProductCard) => {
    try {
      await api.updateProduct(p.id, { active: !p.active });
      setItems((xs) =>
        xs.map((x) => (x.id === p.id ? { ...x, active: !p.active } : x))
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  const counts = {
    all: items.length,
    shoes: items.filter((p) => p.site === "shoes").length,
    wellness: items.filter((p) => p.site === "wellness").length,
    tech: items.filter((p) => p.site === "tech").length,
  };

  return (
    <div>
      {/* Titre desktop */}
      <div className="mb-5 hidden items-end justify-between gap-3 sm:flex">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">Produits</h1>
          <p className="mt-0.5 text-[13px] text-[#777]">
            Sneaker, bien-être et tech — au même endroit.
          </p>
        </div>
        <Link to="/produits/nouveau" className="btn btn-primary btn-sm">
          + Ajouter un produit
        </Link>
      </div>

      {/* Recherche */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#999]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Chercher un produit…"
          className="input pl-12"
        />
      </div>

      {/* Filtres boutiques */}
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {(
          [
            ["all", `Tous (${counts.all})`],
            ["shoes", `Sneaker (${counts.shoes})`],
            ["wellness", `Wellness (${counts.wellness})`],
            ["tech", `Tech (${counts.tech})`],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`chip ${tab === key ? "chip-active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-600">{error}</p>
      )}

      {/* Liste */}
      <div className="mt-5 space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="card flex items-center gap-4 p-4">
              <div className="skeleton h-16 w-16 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-3 w-1/4 rounded" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-[15px] text-[#888]">Aucun produit trouvé.</p>
            <Link to="/produits/nouveau" className="btn btn-primary mt-5 inline-flex">
              + Ajouter un produit
            </Link>
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="card animate-fade-in-up p-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={p.image || undefined}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-2xl bg-[#f1f1ef] object-cover ring-1 ring-black/[0.06]"
                  onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-black/[0.06] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#666]">
                      {SITE_LABEL[p.site]}
                    </span>
                    {p.badge && (
                      <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1d4ed8]">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-[16px] font-semibold leading-snug">{p.name}</p>
                  <p className="mt-0.5 text-[13.5px] text-[#888]">{fmt(p.price)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleActive(p)}
                  className={`btn btn-sm flex-1 ${
                    p.active ? "btn-outline text-emerald-700" : "btn-outline"
                  }`}
                  title={
                    p.active
                      ? "Visible sur le site — toucher pour masquer"
                      : "Masqué — toucher pour mettre en ligne"
                  }
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      p.active ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                  {p.active ? "En ligne" : "Masqué"}
                </button>

                <Link
                  to={`/produits/${p.id}/edition`}
                  className="btn btn-sm btn-primary flex-1"
                >
                  Modifier
                </Link>

                {confirmId === p.id ? (
                  <div className="flex w-full items-center gap-2">
                    <button
                      onClick={() => remove(p.id)}
                      className="btn btn-sm btn-danger flex-1 bg-red-600 text-white"
                      style={{ borderColor: "#dc2626" }}
                    >
                      Oui, supprimer
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="btn btn-sm btn-outline flex-1"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="btn btn-sm btn-outline px-3 text-[#b91c1c]"
                    aria-label={`Supprimer ${p.name}`}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bouton + (mobile, au-dessus des onglets) */}
      <Link
        to="/produits/nouveau"
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1d4ed8] text-white shadow-[0_8px_24px_rgba(29,78,216,0.4)] transition active:scale-95 sm:hidden"
        aria-label="Ajouter un produit"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
    </div>
  );
}
