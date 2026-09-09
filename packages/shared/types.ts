// Types partagés entre les 3 apps

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string | null;
  reference: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod: string | null;
  shippingAddress: Address | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  store?: { name: string; displayName: string };
  customer?: Customer;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  product?: Product;
}

export interface Customer {
  id: string;
  storeId: string;
  email: string;
  phone: string | null;
  name: string | null;
  address: Address | null;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  country: string;
  zip?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface DashboardStats {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  ordersByStatus: { status: string; count: number }[];
  ordersByStore: { storeId: string; count: number; revenue: number }[];
  recentOrders: Order[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
