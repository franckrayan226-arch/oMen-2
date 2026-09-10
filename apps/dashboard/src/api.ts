const API = import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app";

let token: string | null = localStorage.getItem("omen_admin_token");
const listeners = new Set<(t: string | null) => void>();

export function getToken() {
  return token;
}
export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem("omen_admin_token", t);
  else localStorage.removeItem("omen_admin_token");
  listeners.forEach((l) => l(t));
}
export function onAuthChange(fn: (t: string | null) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function handle(res: Response) {
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    /* réponse non-JSON */
  }
  if (!res.ok) {
    if (res.status === 401) setToken(null);
    throw new ApiError(res.status, data.error || `Erreur ${res.status}`);
  }
  return data;
}

export const api = {
  login: (user: string, pass: string) =>
    fetch(`${API}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    }).then(handle),

  logout: () =>
    fetch(`${API}/api/admin/logout`, {
      method: "POST",
      headers: authHeaders(),
    }).then(handle),

  products: (site?: string) => {
    const params = new URLSearchParams({ includeInactive: "1" });
    if (site) params.set("site", site);
    return fetch(`${API}/api/products?${params}`)
      .then(handle)
      .then((d) => d.data as ProductCardAlias[]);
  },

  product: (slug: string) =>
    fetch(`${API}/api/products/${slug}`).then(handle).then((d) => d.product as ProductDetailAlias),

  productAdmin: (id: string) =>
    fetch(`${API}/api/products/admin/${id}`).then(handle).then((d) => d as ProductDetailAlias),

  createProduct: (body: unknown) =>
    fetch(`${API}/api/products`, { method: "POST", headers: { ...jsonHeaders() }, body: JSON.stringify(body) }).then(handle),

  updateProduct: (id: string, body: unknown) =>
    fetch(`${API}/api/products/${id}`, { method: "PUT", headers: { ...jsonHeaders() }, body: JSON.stringify(body) }).then(handle),

  deleteProduct: (id: string) =>
    fetch(`${API}/api/products/${id}`, { method: "DELETE", headers: authHeaders() }).then(handle),

  deleteColor: (colorId: string) =>
    fetch(`${API}/api/products/color/${colorId}`, { method: "DELETE", headers: authHeaders() }).then(handle),

  deleteImage: (imageId: string) =>
    fetch(`${API}/api/products/image/${imageId}`, { method: "DELETE", headers: authHeaders() }).then(handle),

  deleteVariant: (variantId: string) =>
    fetch(`${API}/api/products/variant/${variantId}`, { method: "DELETE", headers: authHeaders() }).then(handle),

  uploadFiles: (files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    return fetch(`${API}/api/upload`, { method: "POST", headers: authHeaders(), body: fd }).then(handle);
  },

  importUrl: (url: string) =>
    fetch(`${API}/api/upload`, {
      method: "POST",
      headers: { ...jsonHeaders() },
      body: JSON.stringify({ url }),
    }).then(handle),

  orders: () => fetch(`${API}/api/orders`, { headers: authHeaders() }).then(handle).then((d) => d.orders as OrderAlias[]),

  setOrderStatus: (id: string, status: string) =>
    fetch(`${API}/api/orders/${id}`, { method: "PATCH", headers: { ...jsonHeaders() }, body: JSON.stringify({ status }) }).then(handle),
};

// aliases pour éviter les imports circulaires de types
type ProductCardAlias = import("./types").ProductCard;
type ProductDetailAlias = import("./types").ProductDetail;
type OrderAlias = import("./types").Order;

function authHeaders(): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
function jsonHeaders(): HeadersInit {
  return { "Content-Type": "application/json", ...authHeaders() };
}