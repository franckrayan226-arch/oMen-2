import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const ref = params.get("ref");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#34c759]/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="mt-6 text-[24px] font-bold tracking-tight text-[#1d1d1f]">Commande confirmée !</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[#6e6e73]">
            Merci pour votre commande. Nous vous contacterons très vite pour la livraison.
          </p>
          {ref && (
            <p className="mt-4 inline-block rounded-full bg-[#f5f5f7] px-4 py-2 text-[12px] font-medium text-[#6e6e73]">
              Référence : {ref}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/catalogue" className="flex h-11 items-center justify-center rounded-btn bg-[#0071e3] text-[14px] font-medium text-white transition-colors hover:bg-[#0058b0]">
              Continuer les achats
            </Link>
            <Link to="/" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3]">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
