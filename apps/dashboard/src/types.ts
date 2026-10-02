export type SiteKey = "shoes" | "wellness" | "tech";

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
  productId?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  reference?: string | null;
  createdAt: string;
  status: string; // PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
  subtotal?: number;
  shipping?: number;
  total: number;
  currency?: string;
  paymentMethod?: string | null;
  shippingAddress?: string | null; // JSON: { name, phone, email, street, city, country }
  notes?: string | null;
  customer?: { name?: string | null; phone?: string | null } | null;
  store?: { name: string; displayName: string } | null;
  items: OrderItem[];
}

// Store config
export const STORES = {
  shoes: { id: "omen-shoes", name: "oMen Shoes", category: "Sneakers" },
  wellness: { id: "omen-wellness", name: "oMen Wellness", category: "Bien-être" },
  tech: { id: "omen-tech", name: "oMen Tech", category: "Smartphones" },
} as const;

export const DEFAULT_SIZES_SHOES = ["38", "39", "40", "41", "42", "43", "44"];
export const DEFAULT_SIZES_APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];