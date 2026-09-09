export interface Variant {
  label: string;
  price: number;
  compareAt?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAt?: number;
  badge?: "Nouveau" | "Promo" | "Best-seller";
  image: string;
  description: string;
  ritual: string[];
  actives: string;
  variants: Variant[];
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "minoxidil-5",
    name: "Minoxidil 5%",
    brand: "Omen Lab",
    category: "Anti-chute",
    price: 15000,
    badge: "Best-seller",
    image: "/img/products/minoxidil-5.jpg",
    description:
      "La référence clinique contre la chute de cheveux. Formule sans propylène glycol, spectre élargi cheveux et barbe, séchage rapide sans film gras.",
    ritual: [
      "Appliquer 1 ml matin et soir sur cuir chevelu sec.",
      "Masser 30 secondes du bout des doigts.",
      "Laisser agir — ne pas rincer.",
      "Résultats visibles entre la 8e et la 16e semaine d'usage régulier.",
    ],
    actives: "Minoxidil 50 mg/ml · Panthénol · Eau purifiée",
    variants: [
      { label: "Flacon 60 ml", price: 15000 },
      { label: "Duo 2 × 60 ml", price: 27000, compareAt: 30000 },
    ],
  },
  {
    id: "2",
    slug: "serum-croissance-barbe",
    name: "Sérum Croissance Barbe",
    brand: "Omen Lab",
    category: "Barbe",
    price: 12000,
    badge: "Nouveau",
    image: "/img/products/serum-barbe.jpg",
    description:
      "Un sérum ciblé pour densifier la barbe et combler les zones clairsemées. Texture légère à absorption immédiate, sans brillance grasse.",
    ritual: [
      "3 à 4 gouttes sur barbe propre et sèche.",
      "Répartir des racines aux pointes, jusqu'à la peau.",
      "Utiliser chaque soir pendant 8 semaines minimum.",
    ],
    actives: "Biotine · Caféine · Huile de nigelle · Vitamine E",
    variants: [
      { label: "Flacon 30 ml", price: 12000 },
      { label: "Flacon 50 ml", price: 18000 },
    ],
  },
  {
    id: "3",
    slug: "shampooing-densifiant",
    name: "Shampooing Densifiant",
    brand: "Omen Lab",
    category: "Soin",
    price: 9000,
    image: "/img/products/shampooing.jpg",
    description:
      "Base lavante douce sans sulfates agressifs qui nettoie sans décaper et prépare le cuir chevelu aux traitements anti-chute.",
    ritual: [
      "Masser sur cheveux mouillés 1 à 2 minutes.",
      "Rincer abondamment.",
      "Utiliser 3 à 4 fois par semaine.",
    ],
    actives: "Caféine · Kératine hydrolysée · Romarin",
    variants: [{ label: "Flacon 250 ml", price: 9000 }],
  },
  {
    id: "4",
    slug: "serum-cuir-chevelu",
    name: "Sérum Cuir Chevelu",
    brand: "Omen Lab",
    category: "Soin",
    price: 11000,
    image: "/img/products/serum-cuir.jpg",
    description:
      "Un soin apaisant quotidien pour les cuirs chevelus sensibles : réduit les démangeaisons, régule les brillances et ancre la fibre.",
    ritual: [
      "Répartir 4 à 6 gouttes raie par raie.",
      "Masser le soir, sur cuir chevelu sec ou légèrement humide.",
      "Usage quotidien sans rinçage.",
    ],
    actives: "Niacinamide · Zinc PCA · Aloe vera",
    variants: [{ label: "Flacon 30 ml", price: 11000 }],
  },
  {
    id: "5",
    slug: "routine-duo-anti-chute",
    name: "Duo Anti-Chute",
    brand: "Omen Lab",
    category: "Rituels",
    price: 22000,
    compareAt: 24000,
    badge: "Promo",
    image: "/img/products/duo.jpg",
    description:
      "Le duo essentiel : Minoxidil 5% et Sérum Cuir Chevelu, pensés pour agir ensemble. Le traitement, puis l'ancrage.",
    ritual: [
      "Minoxidil matin, sérum apaisant au soir.",
      "Espacer les deux applications d'au moins 6 heures.",
      "Recommandé en cure de 3 mois.",
    ],
    actives: "Minoxidil 5% · Niacinamide · Zinc PCA",
    variants: [{ label: "Coffret 2 flacons", price: 22000, compareAt: 24000 }],
  },
  {
    id: "6",
    slug: "huile-rituel-nuit",
    name: "Huile Rituel Nuit",
    brand: "Omen Lab",
    category: "Rituels",
    price: 10000,
    image: "/img/products/huile-nuit.jpg",
    description:
      "Un mélange d'huiles pressées à froid à déposer avant le sommeil. Nourrit la fibre, scelle l'hydratation, parfume discrètement.",
    ritual: [
      "Chauffer 5 gouttes entre les paumes.",
      "Appliquer sur pointes et longueurs.",
      "Laisser poser toute la nuit, 2 à 3 fois par semaine.",
    ],
    actives: "Huile de ricin · Jojoba · Argan · Ylang-ylang",
    variants: [{ label: "Flacon 50 ml", price: 10000 }],
  },
  {
    id: "7",
    slug: "dermaroller-titanium",
    name: "Dermaroller Titane 0,5 mm",
    brand: "Omen Lab",
    category: "Accessoires",
    price: 8000,
    image: "/img/products/dermaroller.jpg",
    description:
      "Micro-aiguilles titane pour potentialiser l'absorption des sérums. À associer au minoxidil pour une routine complète.",
    ritual: [
      "Désinfecter avant chaque usage.",
      "Rouler 8 à 10 passes par zone, pression légère.",
      "Espacer les séances de 5 à 7 jours.",
    ],
    actives: "540 aiguilles titane 0,5 mm",
    variants: [{ label: "0,5 mm", price: 8000 }],
  },
  {
    id: "8",
    slug: "brosse-massante",
    name: "Brosse Massante Silicone",
    brand: "Omen Lab",
    category: "Accessoires",
    price: 5000,
    image: "/img/products/brosse.jpg",
    description:
      "Brosse souple qui active la microcirculation au shampooing et déloge les résidus sans agresser le cuir chevelu.",
    ritual: [
      "Utiliser sous la douche sur cheveux mouillés.",
      "Masser en mouvements circulaires.",
      "Rincer et sécher après chaque usage.",
    ],
    actives: "Silicone médical · Manche ergonomique",
    variants: [{ label: "Taille unique", price: 5000 }],
  },
];

export const CATEGORIES = ["Anti-chute", "Barbe", "Soin", "Rituels", "Accessoires"];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
