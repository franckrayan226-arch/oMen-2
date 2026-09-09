import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function OrderSuccess() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-md px-4 py-12 text-center sm:py-16">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1d4ed8] sm:h-20 sm:w-20">
            <svg className="h-8 w-8 text-white sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <h1 className="text-xl text-[#111] sm:text-2xl" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>Commande confirmée !</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#666] sm:text-[14px]">On va la préparer et te livrer sous 24h.</p>
          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:gap-3">
            <Link to="/catalogue" className="rounded-lg bg-[#1d4ed8] px-6 py-3 text-[14px] font-semibold text-white active:scale-[0.98]">Continuer mes achats</Link>
            <Link to="/" className="text-[13px] text-[#666] hover:text-[#1d4ed8] transition-colors">Retour à l'accueil</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
