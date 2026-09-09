import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface FavoritesStore {
  items: FavoriteItem[];
  addItem: (item: FavoriteItem) => void;
  removeItem: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.productId === item.productId)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      isFavorite: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },
    }),
    { name: "omen-favorites" }
  )
);
