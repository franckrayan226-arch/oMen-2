import { useState, useEffect } from "react";
import { api } from "../api";
import type { Order } from "../types";

const STATUSES = [
  { key: "PENDING", label: "En attente", chip: "bg-amber-50 text-amber-800 border-amber-200" },
  { key: "PROCESSING", label: "En préparation", chip: "bg-sky-50 text-sky-800 border-sky-200" },
  { key: "SHIPPED", label: "Expédiée", chip: "bg-cyan-50 text-cyan-800 border-cyan-200" },
  { key: "DELIVERED", label: "Livrée", chip: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { key: "CANCELLED", label: "Annulée", chip: "bg-red-50 text-red-700 border-red-200" },
  { key: "REFUNDED", label: "Remboursée", chip: "bg-gray-100 text-gray-600 border-gray-200" },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.key, s]));

function statusInfo(status: string) {
  return STATUS_MAP[status] || { key: status, label: status, chip: "bg-gray-100 text-gray-600 border-gray-200" };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function parseAddr(raw?: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    let v: any = JSON.parse(raw);
    if (typeof v === "string") v = JSON.parse(v);
    return v && typeof v === "object" ? v : {};
  } catch {
    return { street: raw };
  }
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.orders();
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    const prev = orders;
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    try {
      await api.setOrderStatus(orderId, status);
    } catch (err: any) {
      setOrders(prev);
      setError(err.message || "Erreur lors de la mise à jour");
    }
  };

  const filtered = orders.filter((o) => (filter === "all" ? true : o.status === filter));

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton mt-3 h-3 w-1/2 rounded" />
            <div className="skeleton mt-2 h-3 w-2/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="mb-4 hidden sm:block">
        <h1 className="text-[24px] font-extrabold tracking-tight">Commandes</h1>
        <p className="mt-0.5 text-[13px] text-[#777]">
          {orders.length} commande{orders.length !== 1 ? "s" : ""} au total
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          onClick={() => setFilter("all")}
          className={`chip ${filter === "all" ? "chip-active" : ""}`}
        >
          Toutes ({orders.length})
        </button>
        {STATUSES.map((s) => {
          const n = orders.filter((o) => o.status === s.key).length;
          if (n === 0 && filter !== s.key) return null;
          return (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`chip ${filter === s.key ? "chip-active" : ""}`}
            >
              {s.label} ({n})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[15px] text-[#888]">Aucune commande pour l&rsquo;instant.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const addr = parseAddr(order.shippingAddress);
            const info = statusInfo(order.status);
            return (
              <div key={order.id} className="card animate-fade-in-up p-4 sm:p-5">
                {/* En-tête */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-bold leading-snug">
                      {addr.name || "Client"}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#888]">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="mt-0.5 text-[12.5px] font-semibold text-[#1d4ed8]">
                      {order.reference || `#${order.id.slice(-8).toUpperCase()}`}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[17px] font-extrabold">{formatPrice(order.total)}</p>
                    <span
                      className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[11.5px] font-bold ${info.chip}`}
                    >
                      {info.label}
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-3.5 rounded-2xl bg-[#f8f8f7] p-3">
                  {(addr.phone || addr.street || addr.city) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {addr.phone && (
                        <a
                          href={`tel:${addr.phone.replace(/\s/g, "")}`}
                          className="btn btn-sm btn-dark"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                          </svg>
                          Appeler {addr.phone}
                        </a>
                      )}
                      <p className="text-[13.5px] text-[#555]">
                        {[addr.street, addr.city].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}
                  {order.notes && (
                    <p className="mt-1.5 break-words text-[12.5px] text-[#999]">{order.notes}</p>
                  )}
                </div>

                {/* Articles */}
                <div className="mt-3 divide-y divide-black/[0.05] border-y border-black/[0.05]">
                  {order.items?.map((item, ii) => (
                    <div key={ii} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="text-[14px] text-[#333]">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="shrink-0 text-[14px] font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Changer le statut */}
                <div className="mt-3.5">
                  <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#999]">
                    Changer le statut
                  </p>
                  <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                    {STATUSES.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => updateStatus(order.id, s.key)}
                        disabled={order.status === s.key}
                        className={`chip ${order.status === s.key ? "chip-active" : ""}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
