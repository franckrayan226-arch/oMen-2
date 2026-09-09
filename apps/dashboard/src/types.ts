export type SiteKey = "shoes" | "wellness";

export interface ColorDef {
  id?: string;
  name: string;
  hex: string;
  sortOrder?: number;
  images?: ImageDef[];
  variants?: VariantDef[];
}

export interface ImageDef {
  id?: string;
  url: string;
  alt?: string;
  sortOrder?: number;
  isMain?: boolean;
  colorId?: string;
}

export interface SizeDef {
  eu: string;
  stock: boolean;
}

export interface VariantDef {
  id?: string;
  colorId?: string;
  size: string;
  sku?: string;
  price?: number;
  compareAt?: number;
  stock?: number;
  active?: boolean;
}

export interface ProductCard {
  id: string;
  site: SiteKey;
  slug: string;
  name: string;
  brand: string;
  category?: string;
  price: number;
  compareAt: number | null;
  badge: string | null;
  active: boolean;
  image: string;
  colorsCount: number;
  coloris?: number;
}

export interface ProductDetail extends ProductCard {
  description: string;
  colors: ColorDef[];
  images: ImageDef[];
  variants: VariantDef[];
  ritual: string[];
  actives?: string;
}

// Form types
export interface ProductFormData {
  storeId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | null;
  category: string;
  tags: string[];
  active: boolean;
  featured: boolean;
  colors: ColorDef[];
  images: ImageDef[];
  variants: VariantDef[];
}

export interface OrderItem {
  site: SiteKey | null;
  productId: string;
  slug: string;
  name: string;
  brand: string | null;
  price: number;
  qty: number;
  size: string | null;
  variant: string | null;
  color: string | null;
  image: string | null;
}

export interface Order {
  id: string;
  createdAt: string;
  status: string;
  customer: {
    name: string;
    phone: string;
    email: string | null;
    city: string;
    address: string;
    country: string | null;
  };
  payment: string;
  accountEmail: string | null;
  items: OrderItem[];
  total: number;
}

// Store config
export const STORES = {
  shoes: { id: "omen-shoes", name: "oMen Shoes", category: "Sneakers" },
  wellness: { id: "omen-wellness", name: "oMen Wellness", category: "Bien-être" },
} as const;

export const DEFAULT_SIZES_SHOES = ["38", "39", "40", "41", "42", "43", "44"];
export const DEFAULT_SIZES_APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];