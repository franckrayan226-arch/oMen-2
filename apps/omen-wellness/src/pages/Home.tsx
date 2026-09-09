import { SpecimenHeader } from "@/components/home/SpecimenHeader";
import { Marquee } from "@/components/home/Marquee";
import { BestSellers } from "@/components/home/BestSellers";
import { RitualSteps } from "@/components/home/RitualSteps";
import { CompositionNotes } from "@/components/home/CompositionNotes";
import { Engagements } from "@/components/home/Engagements";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="grain flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <SpecimenHeader />
        <Marquee />
        <BestSellers />
        <RitualSteps />
        <CompositionNotes />
      </main>
      <Engagements />
      <Footer />
      <MobileNav />
      <div className="h-20 sm:hidden" />
    </div>
  );
}
