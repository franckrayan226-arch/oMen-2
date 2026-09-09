import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth locale côté storefront : les comptes sont persistés dans le localStorage
 * du navigateur, les mots de passe ne JAMAIS stockés en clair — hash SHA-256
 * via l'API crypto.subtle. Quand le dashboard exposera une vraie API d'auth,
 * il suffira de remplacer register/login par des appels fetch.
 */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  passHash: string;
  createdAt: number;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  createdAt: number;
}

export interface OrderRecord {
  id: string;
  date: number;
  items: { productId: string; slug?: string; name: string; brand: string; price: number; image: string; size: string; quantity: number }[];
  total: number;
  city: string;
  status: "confirmee" | "preparation" | "livree";
  paymentMethod: string;
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** — primaire : email ; fallback : téléphone (les clients Togo n'ont pas tous un email) */
export const normalizeId = (raw: string) => raw.trim().toLowerCase();

interface AuthStore {
  users: StoredUser[];
  sessionEmail: string | null;
  orders: Record<string, OrderRecord[]>; // key = normalized email du compte
  register: (u: { name: string; email: string; phone: string; city: string; address: string; password: string }) => Promise<{ ok: true } | { ok: false; error: string }>;
  login: (id: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<StoredUser, "name" | "phone" | "city" | "address">>) => void;
  changePassword: (current: string, next: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  addOrder: (order: Omit<OrderRecord, "id" | "date">) => OrderRecord;
  session: () => PublicUser | null;
  sessionOrders: () => OrderRecord[];
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: [],
      sessionEmail: null,
      orders: {},

      register: async ({ name, email, phone, city, address, password }) => {
        const key = normalizeId(email);
        if (!name.trim()) return { ok: false, error: "Le nom est requis." };
        if (!key.includes("@")) return { ok: false, error: "Email invalide." };
        if (!phone.trim()) return { ok: false, error: "Le numéro de téléphone est requis." };
        if (password.length < 6) return { ok: false, error: "Le mot de passe doit faire au moins 6 caractères." };
        if (get().users.some((u) => normalizeId(u.email) === key)) {
          return { ok: false, error: "Un compte existe déjà avec cet email." };
        }
        const passHash = await sha256(password);
        const user: StoredUser = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: key,
          phone: phone.trim(),
          city,
          address: address.trim(),
          passHash,
          createdAt: Date.now(),
        };
        set((s) => ({ users: [...s.users, user], sessionEmail: user.email }));
        return { ok: true };
      },

      login: async (id, password) => {
        const key = normalizeId(id);
        const user = get().users.find((u) => normalizeId(u.email) === key || normalizeId(u.phone) === key);
        if (!user) return { ok: false, error: "Aucun compte trouvé avec cet email ou téléphone." };
        const hash = await sha256(password);
        if (hash !== user.passHash) return { ok: false, error: "Mot de passe incorrect." };
        set({ sessionEmail: user.email });
        return { ok: true };
      },

      logout: () => set({ sessionEmail: null }),

      updateProfile: (patch) => {
        const s = get();
        if (!s.sessionEmail) return;
        set({
          users: s.users.map((u) => (u.email === s.sessionEmail ? { ...u, ...patch } : u)),
        });
      },

      changePassword: async (current, next) => {
        const s = get();
        const user = s.users.find((u) => u.email === s.sessionEmail);
        if (!user) return { ok: false, error: "Session expirée." };
        if (next.length < 6) return { ok: false, error: "Le nouveau mot de passe doit faire au moins 6 caractères." };
        const curHash = await sha256(current);
        if (curHash !== user.passHash) return { ok: false, error: "Mot de passe actuel incorrect." };
        const passHash = await sha256(next);
        set({
          users: s.users.map((u) => (u.email === user.email ? { ...u, passHash } : u)),
        });
        return { ok: true };
      },

      addOrder: (order) => {
        const s = get();
        const record: OrderRecord = { ...order, id: `OM-${Date.now().toString(36).toUpperCase()}`, date: Date.now() };
        if (!s.sessionEmail) return record; // invité : pas de rattachement
        set((st) => ({
          orders: { ...st.orders, [s.sessionEmail!]: [record, ...(st.orders[s.sessionEmail!] ?? [])] },
        }));
        return record;
      },

      session: () => {
        const s = get();
        if (!s.sessionEmail) return null;
        const u = s.users.find((x) => x.email === s.sessionEmail);
        if (!u) return null;
        const { passHash: _passHash, ...pub } = u;
        return pub;
      },

      sessionOrders: () => {
        const s = get();
        return s.sessionEmail ? (s.orders[s.sessionEmail] ?? []) : [];
      },
    }),
    { name: "omen-shoes-auth" }
  )
);
