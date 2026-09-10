import { useState, useEffect } from "react";

const API = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
const STORE_ID = "omen-wellness";

function resolveImage(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API}${url}`;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAt: number | null;
  badge: string | null;
  image: string;
  colorsCount: number;
  category: string;
  active: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/products?storeId=${STORE_ID}&includeInactive=0`)
      .then((r) => r.json())
      .then((d) => {
        const items = (d.data || []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          brand: p.brand || "Omen Lab",
          price: p.price,
          compareAt: p.compareAt,
          badge: p.badge || null,
          image: resolveImage(p.images?.[0]?.url) || resolveImage(p.colors?.[0]?.images?.[0]?.url) || "/img/products/minoxidil-5.jpg",
          colorsCount: p.colors?.length || 0,
          category: p.category || "",
          active: p.active,
        }));
        setProducts(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${API}/api/products/${slug}`)
      .then((r) => r.json())
      .then((d) => setProduct(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading };
}