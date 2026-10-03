import { useState, useEffect } from "react";

const API = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
const STORE_ID = "omen-tech";

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/categories?storeId=${STORE_ID}`)
      .then((r) => r.json())
      .then((d) => {
        const items = (d.data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          image: c.image || "",
          sortOrder: c.sortOrder ?? 0,
        }));
        setCategories(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
