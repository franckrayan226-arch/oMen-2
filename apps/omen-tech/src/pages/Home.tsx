import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ServiceStrip } from "@/components/home/ServiceStrip";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <ServiceStrip />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
