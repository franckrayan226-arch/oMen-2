import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { LifestyleBento } from "@/components/home/LifestyleBento";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { TrendingNow } from "@/components/home/TrendingNow";
import { ServiceStrip } from "@/components/home/ServiceStrip";
import { Newsletter } from "@/components/home/Newsletter";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 sm:pt-6">
          <HeroCarousel />
        </div>
        <FeaturedGrid />
        <LifestyleBento />
        <BrandMarquee />
        <TrendingNow />
        <ServiceStrip />
        <Newsletter />
      </main>
      <Footer />
      <MobileNav />
      <div className="h-20 sm:hidden" />
    </div>
  );
}
