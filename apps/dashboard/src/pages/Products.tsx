import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api";
import type { ProductCard } from "@/types";
import { fmt } from "@/lib/format";

type Tab = "all" | "shoes" | "wellness";

export default function ProductsPage() {
  const [items, setItems] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.products()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(
      (p) =>
        (tab === "all" || p.site === tab) &&
        (!s || p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s))
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
      setItems((xs) => xs.map((x) => (x.id === p.id ? { ...x, active: !p.active } : x)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const counts = {
    all: items.length,
    shoes: items.filter((p) => p.site === "shoes").length,
    wellness: items.filter((p) => p.site === "wellness").length,
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Produits</h1>
          <p className="mt-0.5 text-[12.5px] text-[#777]">Les deux boutiques — sneaker et bien-être.</p>
        </div>
        <Link
          to="/produits/nouveau"
          className="rounded-xl bg-[#1d4ed8] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1e40af] active:scale-[0.98]"
        >
          + Ajouter un article
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {(
          [
            ["all", `Tous (${counts.all})`],
            ["shoes", `Sneaker (${counts.shoes})`],
            ["wellness", `Wellness (${counts.wellness})`],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 text-[12px] font-semibold transition ${
              tab === key ? "bg-[#111] text-white" : "bg-white text-[#444] ring-1 ring-black/[0.08] hover:bg-black/[0.03]"
            }`}
          >
            {label}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un article, une marque…"
          className="ml-auto w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-[13px] outline-none transition focus:border-[#1d4ed8] sm:w-72"
        />
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-600 ring-1 ring-red-100">{error}</p>}

      <div className="mt-5 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
        {loading ? (
          <div className="divide-y divide-black/[0.05]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="skeleton h-14 w-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3.5 w-1/3 rounded" />
                  <div className="skeleton h-3 w-1/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[13px] text-[#888]">Aucun article trouvé.</div>
        ) : (
          <ul className="divide-y divide-black/[0.05]">
            {filtered.map((p) => (
              <li key={p.id} className="animate-fade-in-up flex flex-wrap items-center gap-3 p-3.5 sm:gap-4 sm:p-4">
                <img
                  src={p.image || undefined}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl bg-[#f1f1ef] object-cover ring-1 ring-black/[0.06]"
                  onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-black/[0.05] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#666]">
                      {p.site === "shoes" ? "Sneaker" : "Wellness"}
                    </span>
                    {p.badge && <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1d4ed8]">{p.badge}</span>}
                  </div>
                  <p className="mt-1 truncate text-[14px] font-semibold">{p.name}</p>
                  <p className="text-[11.5px] text-[#888]">
                    {p.brand} · {fmt(p.price)}
                    {p.site === "shoes" ? ` · ${p.colorsCount} coloris` : p.category ? ` · ${p.category}` : ""}
                  </p>
                </div>

                <button
                  onClick={() => toggleActive(p)}
                  title={p.active ? "Visible sur le site — cliquer pour masquer" : "Masqué — cliquer pour publier"}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ring-1 transition ${
                    p.active ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-gray-50 text-gray-400 ring-gray-200"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${p.active ? "bg-emerald-500" : "bg-gray-300"}`} />
                  {p.active ? "En ligne" : "Masqué"}
                </button>

                <Link
                  to={`/produits/${p.id}/edition`}
                  className="rounded-xl px-3.5 py-2 text-[12.5px] font-semibold text-[#1d4ed8] transition hover:bg-blue-50"
                >
                  Modifier
                </Link>

                {confirmId === p.id ? (
                  <span className="flex items-center gap-1">
                    <button onClick={() => remove(p.id)} className="rounded-xl bg-red-600 px-3 py-2 text-[12.5px] font-semibold text-white">
                      Supprimer
                    </button>
                    <button onClick={() => setConfirmId(null)} className="rounded-xl px-2.5 py-2 text-[12.5px] text-[#888]">
                      Annuler
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="rounded-xl px-3 py-2 text-[12.5px] font-medium text-[#b91c1c] transition hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
