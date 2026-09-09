import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  badgePulse: boolean;
  triggerBadgePulse: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      badgePulse: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variant === item.variant
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variant === item.variant
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              badgePulse: true,
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }], badgePulse: true };
        });
        setTimeout(() => set({ badgePulse: false }), 300);
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variant === variant)
          ),
        }));
      },

      updateQuantity: (productId, variant, quantity) => {
        if (quantity < 1) return get().removeItem(productId, variant);
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variant === variant
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      triggerBadgePulse: () => {
        set({ badgePulse: true });
        setTimeout(() => set({ badgePulse: false }), 300);
      },
    }),
    { name: "omen-wellness-cart" }
  )
);
