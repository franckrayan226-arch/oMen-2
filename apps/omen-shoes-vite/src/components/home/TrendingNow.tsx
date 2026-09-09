import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const FALLBACK = [
  { id: "9", slug: "nike-air-jordan-1-low", name: "Nike Air Jordan 1 Low", brand: "Nike", price: 52000, compareAt: 60000, badge: "Promo" as const, image: "/shoes/nike-air-max-90.jpg" },
  { id: "10", slug: "adidas-ultraboost", name: "adidas Ultraboost 22", brand: "adidas", price: 55000, badge: "Top" as const, image: "/shoes/adidas-samba-og.jpg" },
  { id: "11", slug: "new-balance-990", name: "New Balance 990v6", brand: "New Balance", price: 68000, image: "/shoes/new-balance-550.jpg" },
  { id: "12", slug: "puma-rs-x", name: "Puma RS-X Retro", brand: "Puma", price: 45000, badge: "Nouveau" as const, image: "/shoes/puma-suede-classic.jpg" },
];

export function TrendingNow() {
  const { products: apiProducts } = useProducts();
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 56 });

  // Filter promo products from API, fallback to static
  const products = apiProducts.length > 0
    ? apiProducts.filter(p => p.compareAt).slice(0, 4).map(p => ({ ...p, colors: p.colorsCount }))
    : FALLBACK;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <section className="mx-auto mt-8 max-w-7xl px-3 sm:px-6 sm:mt-12">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="animate-pulse h-2 w-2 rounded-full bg-red-500" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 sm:text-[11px]">Offres Spéciales</p>
          </div>
          <h2 className="text-[22px] text-[#111] sm:text-[28px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>
            Promos du moment
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[12px] font-bold text-red-600">
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 sm:hidden bg-red-50 px-3 py-2 rounded-lg">
        <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[11px] font-bold text-red-600">
          Promo: {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </span>
      </div>
    </section>
  );
}