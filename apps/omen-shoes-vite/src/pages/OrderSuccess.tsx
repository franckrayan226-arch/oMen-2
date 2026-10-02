import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const WHATSAPP_NUMBER = "22663213029";
const API_BASE = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");

type OrderLike = {
  reference: string;
  total: number;
  paymentMethod: string;
  shippingAddress?: string | null;
  items?: { name: string; quantity: number }[];
};

const PAY_LABELS: Record<string, string> = {
  ORANGE_MONEY: "Orange Money",
  MOOV_MONEY: "Moov Money",
  COD: "À la livraison",
};

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const ref = params.get("ref");
  const [order, setOrder] = useState<OrderLike | null>(null);

  useEffect(() => {
    if (!ref) return;
    fetch(`${API_BASE}/api/payments/${encodeURIComponent(ref)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d.order) setOrder(d.order);
      })
      .catch(() => {});
  }, [ref]);

  const addr = useMemo(() => {
    if (!order?.shippingAddress) return {} as Record<string, string>;
    try {
      return JSON.parse(order.shippingAddress);
    } catch {
      return {};
    }
  }, [order]);

  const message = useMemo(() => {
    const lines = ["NOUVELLE COMMANDE — oMen Sneaker"];
    if (ref) lines.push(`Réf: ${ref}`);
    if (order) {
      if (addr.name || addr.phone) lines.push(`Client: ${addr.name || "-"} (${addr.phone || "-"})`);
      if (order.items?.length)
        lines.push(`Articles: ${order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}`);
      lines.push(`Total: ${order.total.toLocaleString("fr-FR")} FCFA`);
      lines.push(`Paiement: ${PAY_LABELS[order.paymentMethod] || order.paymentMethod}`);
      if (addr.heure) lines.push(`Heure de livraison: ${addr.heure}`);
      if (addr.position) lines.push(`Position exacte: ${addr.position}`);
      if (addr.city) lines.push(`Ville: ${addr.city}`);
      if (addr.street) lines.push(`Adresse: ${addr.street}`);
      if (addr.proof) lines.push(`Preuve de paiement: ${addr.proof}`);
    }
    return lines.join("\n");
  }, [order, addr, ref]);

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

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
          <p className="mt-2 text-[13px] leading-relaxed text-[#666] sm:text-[14px]">Envoie les détails de ta commande (heure, position, capture de paiement) sur WhatsApp — c&rsquo;est déjà pré-rempli.</p>
          {ref && (
            <p className="mt-4 inline-block rounded-lg border border-[#e0d6d0] bg-white px-4 py-2 text-[12px] text-[#666]">
              Référence : {ref}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-3 text-[14px] font-semibold text-white active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 0 16.47Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
              </svg>
              Envoyer sur WhatsApp
            </a>
            <Link to="/catalogue" className="rounded-lg border border-[#e0d6d0] bg-white px-6 py-3 text-[14px] font-semibold text-[#111] active:scale-[0.98]">Continuer mes achats</Link>
            <Link to="/" className="text-[13px] text-[#666] hover:text-[#1d4ed8] transition-colors">Retour à l'accueil</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
