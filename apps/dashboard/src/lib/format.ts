export const fmt = (n: number) => `${(n || 0).toLocaleString("fr-FR")} F`;

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

/** Slug auto depuis un nom (accents retirés) */
export function autoSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];
export const BRANDS_SHOES = ["Nike", "Jordan", "adidas", "New Balance", "Puma", "Louis Vuitton", "Vans", "Salomon", "Reebok"];
export const CATEGORIES_WELLNESS = ["Anti-chute", "Barbe", "Soin", "Rituels", "Accessoires"];
export const BADGES = ["Nouveau", "Promo", "Top", "Best-seller"];

export const STATUS_FLOW = ["nouvelle", "confirmée", "livrée", "annulée"] as const;
export const STATUS_STYLE: Record<string, string> = {
  nouvelle: "bg-blue-50 text-blue-700 border-blue-200",
  "confirmée": "bg-amber-50 text-amber-700 border-amber-200",
  "livrée": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "annulée": "bg-gray-100 text-gray-500 border-gray-200",
};
