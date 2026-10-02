import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const ref = params.get("ref");

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] pb-20 md:pb-0">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-5">
        <div className="max-w-md text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#999]">
            Confirmé
          </p>
          <h1 className="mt-4 text-[34px] font-bold uppercase leading-tight tracking-[-0.02em] lg:text-[44px]">
            Commande reçue.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#555]">
            Merci pour votre commande. Nous vous contacterons très vite pour la livraison.
          </p>
          {ref && (
            <p className="mt-6 inline-block border border-[#e5e5e5] bg-white px-4 py-2 text-[12px] text-[#555]">
              Référence&nbsp;: {ref}
            </p>
          )}
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              to="/catalogue"
              className="w-full bg-[#111] px-6 py-4 text-[13px] font-medium text-white transition-opacity hover:opacity-80"
            >
              Continuer les achats
            </Link>
            <Link
              to="/"
              className="text-[13px] text-[#999] underline underline-offset-4 transition-colors hover:text-[#111]"
            >
              Retour à l&rsquo;accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
