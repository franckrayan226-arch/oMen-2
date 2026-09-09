import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Qui nous sommes",
    body: [
      "Omen Sneaker est une boutique de sneakers authentiques opérant au Togo et au Burkina Faso, avec une disponibilité à Lomé et à Ouagadougou. Nous vendons en ligne via ce site et assurons la livraison dans les deux pays.",
      "Pour toute question relative à vos données : contactez-nous sur WhatsApp, réponse rapide.",
    ],
  },
  {
    title: "2. Données que nous collectons",
    body: [
      "Lors d'une commande : votre nom, numéro de téléphone, email (optionnel), adresse et ville de livraison. Ces informations sont strictement nécessaires à la préparation et à la livraison de votre commande.",
      "Si vous créez un compte : les mêmes informations, conservées pour vous permettre de commander plus vite et de retrouver votre historique.",
      "Vous pouvez commander sans créer de compte : aucune inscription n'est requise pour acheter.",
    ],
  },
  {
    title: "3. Mots de passe et sécurité",
    body: [
      "Si vous créez un compte, votre mot de passe n'est jamais stocké en clair : il est transformé par une fonction de hachage cryptographique (SHA-256) avant d'être enregistré. Même nous ne pouvons pas le lire.",
      "Vos données de compte et votre historique de commandes sont conservés localement dans votre navigateur. Nous vous recommandons de ne pas utiliser un appareil partagé pour rester connecté.",
    ],
  },
  {
    title: "4. Paiements",
    body: [
      "Les paiements sont traités par des prestataires externes : Wave, Orange Money, MTN MoMo et GeniusPay.",
      "Nous ne voyons, ne stockons et ne manipulons jamais vos codes secrets, numéros complets de carte ou identifiants de paiement. Le paiement est validé directement par le prestataire.",
    ],
  },
  {
    title: "5. Utilisation de vos données",
    body: [
      "Vos informations servent uniquement à : traiter et livrer vos commandes, vous contacter à propos d'une commande (confirmation, adresse, délai), et — si vous avez un compte — pré-remplir vos prochaines commandes.",
      "Nous ne vendons pas vos données. Nous ne les partageons pas avec des tiers à des fins publicitaires. Seul le transporteur ou l'agence partenaire reçoit l'adresse nécessaire à la livraison.",
    ],
  },
  {
    title: "6. Communications",
    body: [
      "Si vous vous inscrivez à la newsletter, nous utilisons votre email uniquement pour vous envoyer les nouveautés et promos. Un clic unique suffit pour vous désabonner, présent dans chaque envoi.",
      "Les échanges de conseil produit (WhatsApp, Snapchat, TikTok) servent uniquement à répondre à votre question du moment.",
    ],
  },
  {
    title: "7. Vos droits",
    body: [
      "Vous pouvez à tout moment : demander la suppression de votre compte et de son historique (écrivez-nous sur WhatsApp), modifier vos informations depuis la page Profil, ou commander en invité sans laisser de trace de compte.",
      "La suppression du compte efface les données conservées dans votre navigateur. Les commandes déjà transmises pour traitement et livraison ne peuvent évidemment pas être « dé-effacées » de notre opérationnel.",
    ],
  },
  {
    title: "8. Cookies et stockage local",
    body: [
      "Ce site n'utilise pas de cookies publicitaires ni de traceurs tiers. Le stockage local de votre navigateur sert uniquement à des fins fonctionnelles : panier en cours, favoris, session de compte.",
      "Vous pouvez tout effacer à tout moment en vidant les données de navigation de votre navigateur — vos favoris et votre session disparaîtront, aucune conséquence ailleurs.",
    ],
  },
  {
    title: "9. Modifications",
    body: [
      "Cette politique peut évoluer si nos pratiques changent (par exemple à l'ouverture d'un espace client serveur). La date de mise à jour figure ci-dessous et les changements importants seront signalés sur cette page.",
    ],
  },
];

export default function Confidentialite() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          {/* header */}
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#1d4ed8]">Légal</p>
            <h1 className="mt-2 text-[26px] text-[#111] sm:text-[32px]" style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}>
              Politique de confidentialité
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-[#111]/55">
              Comment nous collectons, utilisons et protégeons vos données. En français clair, sans jargon.
            </p>
            <p className="mt-3 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#111]/35">
              Dernière mise à jour : septembre 2026
            </p>
          </div>

          {/* encart clé */}
          <div className="glass mt-8 flex flex-col gap-3 rounded-[22px] p-5 sm:flex-row sm:items-center sm:gap-5">
            <div className="glass-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#1d4ed8]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-[13.5px] font-bold text-[#111]">L'essentiel en une phrase</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[#111]/60">
                Vos données servent à livrer vos commandes, rien d'autre. Mot de passe chiffré, jamais de revente, jamais de spam, et vous pouvez commander sans compte.
              </p>
            </div>
          </div>

          {/* sections */}
          <div className="mt-8 space-y-3">
            {SECTIONS.map((s) => (
              <details key={s.title} className="glass group rounded-[18px] px-5 py-4 open:pb-5" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-bold text-[#111] [&::-webkit-details-marker]:hidden">
                  {s.title}
                  <svg className="h-4 w-4 shrink-0 text-[#111]/35 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className="mt-2.5 space-y-2">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-[13px] leading-relaxed text-[#111]/65">{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>

          {/* contact */}
          <div className="glass-deep mt-8 rounded-[22px] p-5 text-center sm:p-6">
            <p className="text-[13.5px] font-bold text-white">Une question sur vos données ?</p>
            <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed text-white/60">
              Écrivez-nous sur WhatsApp : réponse rapide, suppression de compte sur simple demande.
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <a
                href="https://wa.me/22890000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#111] transition-transform active:scale-95 sm:w-auto"
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                Contact WhatsApp
              </a>
              <Link
                to="/profil"
                className="w-full rounded-full border border-white/25 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 transition-transform active:scale-95 sm:w-auto"
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                Gérer mon compte
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <div className="h-20 sm:hidden" />
    </div>
  );
}
