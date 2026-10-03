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
  brand: string;
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
  couponCode?: string | null;
  discount?: number;
  commission?: number;
  currency?: string;
  paymentMethod?: string | null;
  shippingAddress?: string | null; // JSON: { name, phone, email, street, city, country }
  notes?: string | null;
  customer?: { name?: string | null; phone?: string | null } | null;
  store?: { name: string; displayName: string } | null;
  items: OrderItem[];
}

// Catégories (gérées depuis le dashboard, servies aux fronts)
export interface Category {
  id: string;
  storeId: string;
  name: string;
  image: string;
  sortOrder: number;
  active: boolean;
}

// Partenaires influenceurs
export interface Partner {
  id: string;
  storeId: string;
  name: string;
  phone: string | null;
  handle: string | null;
  code: string;
  active: boolean;
  createdAt: string;
  ordersCount: number;
  itemCount: number;
  discountTotal: number;
  commissionTotal: number;
  lastUsed: string | null;
}

export interface PartnerOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface PartnerOrder {
  id: string;
  reference: string | null;
  createdAt: string;
  status: string;
  subtotal: number;
  total: number;
  discount: number;
  commission: number;
  customerName: string | null;
  customerPhone: string | null;
  items: PartnerOrderItem[];
}

export interface AppNotification {
  id: string;
  storeId: string;
  partnerId: string | null;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  createdAt: string;
  partner?: { name: string; code: string } | null;
}

// Store config
export const STORES = {
  shoes: { id: "omen-shoes", name: "oMen Shoes", category: "Sneakers" },
  wellness: { id: "omen-wellness", name: "oMen Wellness", category: "Bien-être" },
  tech: { id: "omen-tech", name: "oMen Tech", category: "Smartphones" },
} as const;

export const DEFAULT_SIZES_SHOES = ["38", "39", "40", "41", "42", "43", "44"];
export const DEFAULT_SIZES_APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];