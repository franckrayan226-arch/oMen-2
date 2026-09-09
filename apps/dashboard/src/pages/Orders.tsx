import { useState, useEffect } from "react";
import { api } from "../api";
import type { Order } from "../types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
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
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.setOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour");
    }
  };

  const filtered = orders.filter((o) =>
    filter === "all" ? true : o.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-24">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold">Commandes</h1>
        <p className="mt-1 text-sm text-gray-500">
          {orders.length} commande{orders.length !== 1 ? "s" : ""} au total
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === s
                ? "bg-[var(--brand)] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "all" ? "Toutes" : s}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Aucune commande trouvée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customer?.name || "Client inconnu"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400">#{order.id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 border-t border-gray-100 pt-3">
                {order.items?.map((item, ii) => (
                  <div
                    key={ii}
                    className="flex items-center justify-between text-xs text-gray-600"
                  >
                    <span>
                      {item.name}
                      {item.size ? ` (${item.size})` : ""}
                      {item.color ? ` — ${item.color}` : ""}
                    </span>
                    <span>
                      {item.qty} × {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment info */}
              <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span>
                  Paiement:{" "}
                  <span className="font-medium">{order.payment || "—"}</span>
                </span>
                {order.customer?.phone && (
                  <span>
                    Tél: <span className="font-medium">{order.customer.phone}</span>
                  </span>
                )}
                {order.customer?.city && (
                  <span>
                    Ville: <span className="font-medium">{order.customer.city}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}