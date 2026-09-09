import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function OrderSuccess() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="glass mx-auto max-w-md rounded-3xl px-6 py-12 text-center sm:py-16">
          <div className="glass-deep mx-auto flex h-14 w-14 items-center justify-center rounded-full">
            <svg className="h-6 w-6 text-[#f4efe3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <p className="label-mono mt-6 text-[9px] text-[#b4552d]">Enregistrement confirmé</p>
          <h1 className="font-display mt-2 text-[26px] text-[#17211a] sm:text-[32px]">Commande reçue</h1>
          <p className="mt-3 text-[12px] leading-relaxed text-[#17211a]/70">Ta préparation part sous 24h à Lomé. Un message WhatsApp confirme l'expédition.</p>
          <div className="mt-8 flex flex-col gap-2.5">
            <Link to="/catalogue" className="btn-ink rounded-full px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em]">Continuer</Link>
            <Link to="/" className="link-underline text-[10px] uppercase tracking-[0.16em] text-[#17211a]/60 hover:text-[#17211a]">Retour à l'accueil</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
