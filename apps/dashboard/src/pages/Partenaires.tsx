import { useEffect, useState } from "react";
import { api } from "@/api";
import type { Partner, PartnerOrder, AppNotification } from "@/types";
import { fmt } from "@/lib/format";

const STORE_CHOICES = [
  { id: "omen-shoes", label: "oMen Shoes" },
  { id: "omen-wellness", label: "oMen Wellness" },
  { id: "omen-tech", label: "oMen Tech" },
] as const;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PartnersPage() {
  const [storeId, setStoreId] = useState<string>("omen-shoes");
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cfg, setCfg] = useState({ discountPct: 10, commissionPct: 5 });
  const [cfgSaving, setCfgSaving] = useState(false);

  const [notifs, setNotifs] = useState<AppNotification[]>([]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ordersCache, setOrdersCache] = useState<Record<string, PartnerOrder[]>>({});
  const [ordersLoading, setOrdersLoading] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([api.partners(storeId), api.partnerConfig(storeId), api.notifications()])
      .then(([partners, config, notifRes]) => {
        setItems(partners);
        setCfg({ discountPct: config.discountPct, commissionPct: config.commissionPct });
        setNotifs(notifRes.data.filter((n) => n.storeId === storeId));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [storeId]);

  const saveCfg = async () => {
    setCfgSaving(true);
    setError("");
    try {
      const r = await api.updatePartnerConfig(storeId, cfg.discountPct, cfg.commissionPct);
      setCfg({ discountPct: r.discountPct, commissionPct: r.commissionPct });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCfgSaving(false);
    }
  };

  const toggleActive = async (p: Partner) => {
    try {
      await api.updatePartner(p.id, { active: !p.active });
      setItems((xs) => xs.map((x) => (x.id === p.id ? { ...x, active: !p.active } : x)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const copyCode = async (p: Partner) => {
    try {
      await navigator.clipboard.writeText(p.code);
      setCopiedId(p.code);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {}
  };

  const toggleDetails = async (p: Partner) => {
    if (expandedId === p.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(p.id);
    if (!ordersCache[p.id]) {
      setOrdersLoading(p.id);
      try {
        const orders = await api.partnerOrders(p.id);
        setOrdersCache((c) => ({ ...c, [p.id]: orders }));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setOrdersLoading(null);
      }
    }
  };

  const markAllRead = async () => {
    try {
      await api.markNotificationsRead(storeId);
      setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
      window.dispatchEvent(new Event("omen-notif-updated"));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div>
      {/* Titre */}
      <div className="mb-5 hidden items-end justify-between gap-3 sm:flex">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">Partenaires</h1>
          <p className="mt-0.5 text-[13px] text-[#777]">
            Codes promo des influenceurs — ventes attribuées et commissions.
          </p>
        </div>
      </div>

      {/* Boutique */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STORE_CHOICES.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setStoreId(s.id);
              setExpandedId(null);
            }}
            className={`chip ${storeId === s.id ? "chip-active" : ""}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-600">{error}</div>
      )}

      {/* Paramètres */}
      <div className="card mb-5 p-4">
        <p className="text-[15px] font-semibold">Paramètres du programme</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="text-[12.5px] font-medium text-[#666]">Réduction pour le client (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={cfg.discountPct}
              onChange={(e) => setCfg((c) => ({ ...c, discountPct: Number(e.target.value) || 0 }))}
              className="input mt-1 w-28"
            />
          </label>
          <label className="block">
            <span className="text-[12.5px] font-medium text-[#666]">Commission influenceur (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={cfg.commissionPct}
              onChange={(e) => setCfg((c) => ({ ...c, commissionPct: Number(e.target.value) || 0 }))}
              className="input mt-1 w-28"
            />
          </label>
          <button onClick={saveCfg} disabled={cfgSaving} className="btn btn-primary btn-sm">
            {cfgSaving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
        <p className="mt-2 text-[12px] text-[#999]">
          Ces pourcentages s&rsquo;appliquent à tous les codes de cette boutique.
        </p>
      </div>

      {/* Notifications : ventes avec codes */}
      <div className="card mb-5 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[15px] font-semibold">
            Ventes avec codes
            {unread > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1d4ed8] px-1.5 text-[11px] font-bold text-white">
                {unread}
              </span>
            )}
          </p>
          {unread > 0 && (
            <button onClick={markAllRead} className="btn btn-outline btn-sm">
              Tout marquer comme lu
            </button>
          )}
        </div>
        {notifs.length === 0 ? (
          <p className="mt-3 text-[13px] text-[#999]">Aucune vente avec un code pour le moment.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {notifs.slice(0, 8).map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${
                  n.read ? "border-black/[0.06] bg-white" : "border-[#1d4ed8]/30 bg-blue-50/40"
                }`}
              >
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1d4ed8]" />}
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold">{n.title}</p>
                  <p className="mt-0.5 truncate text-[12.5px] text-[#777]">{n.body}</p>
                </div>
                <span className="shrink-0 text-[11.5px] text-[#999]">{fmtDate(n.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liste des partenaires */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4">
              <div className="skeleton h-4 w-40" />
              <div className="skeleton mt-3 h-3 w-64" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[15px] text-[#888]">Aucun influenceur inscrit pour l&rsquo;instant.</p>
          <p className="mt-1 text-[13px] text-[#aaa]">
            Partagez la page <span className="font-mono">/partenaires</span> de la boutique : le code est
            généré automatiquement.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="card animate-fade-in-up p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15.5px] font-semibold">{p.name}</p>
                    {!p.active && (
                      <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[10.5px] font-semibold text-[#777]">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-[#888]">
                    {[p.handle, p.phone].filter(Boolean).join(" · ") || "—"} · inscrit le{" "}
                    {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <button
                  onClick={() => copyCode(p)}
                  className="rounded-lg border border-[#1d4ed8] bg-blue-50/50 px-3 py-1.5 font-mono text-[14px] font-bold tracking-[0.18em] text-[#1d4ed8] transition-colors hover:bg-[#1d4ed8] hover:text-white"
                  title="Copier le code"
                >
                  {copiedId === p.code ? "Copié !" : p.code}
                </button>

                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(p)} className={`btn btn-sm ${p.active ? "btn-outline" : "btn-dark"}`}>
                    {p.active ? "Actif" : "Inactif"}
                  </button>
                  <button onClick={() => toggleDetails(p)} className="btn btn-sm btn-primary">
                    {expandedId === p.id ? "Masquer" : "Détails"}
                  </button>
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="btn btn-sm btn-outline"
                    aria-label={`Supprimer ${p.name}`}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: "Commandes", value: String(p.ordersCount) },
                  { label: "Articles vendus", value: String(p.itemCount) },
                  { label: "Réduction accordée", value: fmt(p.discountTotal) },
                  { label: "Commission due", value: fmt(p.commissionTotal) },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-black/[0.03] px-3 py-2">
                    <p className="text-[11px] text-[#999]">{s.label}</p>
                    <p className="mt-0.5 text-[14px] font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Confirmation suppression */}
              {confirmId === p.id && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5">
                  <span className="text-[13px] text-red-600">Supprimer ce partenaire ?</span>
                  <button
                    onClick={async () => {
                      try {
                        await api.deletePartner(p.id);
                        setItems((xs) => xs.filter((x) => x.id !== p.id));
                      } catch (e: any) {
                        setError(e.message);
                      }
                      setConfirmId(null);
                    }}
                    className="btn btn-sm btn-dark"
                  >
                    Oui
                  </button>
                  <button onClick={() => setConfirmId(null)} className="btn btn-sm btn-outline">
                    Non
                  </button>
                </div>
              )}

              {/* Détail des ventes */}
              {expandedId === p.id && (
                <div className="mt-3 border-t border-black/[0.07] pt-3">
                  {ordersLoading === p.id ? (
                    <div className="skeleton h-16 w-full" />
                  ) : (ordersCache[p.id]?.length ?? 0) === 0 ? (
                    <p className="text-[13px] text-[#999]">Aucune vente avec ce code pour l&rsquo;instant.</p>
                  ) : (
                    <div className="space-y-2">
                      {ordersCache[p.id].map((o) => (
                        <div key={o.id} className="rounded-xl border border-black/[0.06] p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[13px] font-semibold">
                              {o.reference || `#${o.id.slice(-8).toUpperCase()}`}
                              <span className="ml-2 font-normal text-[#888]">
                                {o.customerName || "Client"} · {fmtDate(o.createdAt)}
                              </span>
                            </p>
                            <p className="text-[13px] font-bold">{fmt(o.total)}</p>
                          </div>
                          <ul className="mt-1.5 space-y-0.5">
                            {o.items.map((it, idx) => (
                              <li key={idx} className="flex justify-between text-[12.5px] text-[#666]">
                                <span>
                                  {it.quantity} × {it.name}
                                </span>
                                <span>{fmt(it.price * it.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="mt-1.5 text-[12px] text-[#16a34a]">
                            Réduction -{fmt(o.discount)} · Commission {fmt(o.commission)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
