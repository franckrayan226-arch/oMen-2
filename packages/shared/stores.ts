// Config de chaque store — utilisé par les frontends

export const STORES = {
  shoes: {
    id: process.env.NEXT_PUBLIC_STORE_ID_SHOES || '',
    name: 'omen-shoes',
    displayName: 'oMen Shoes',
    domain: 'omenshoes.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    description: 'Chaussures premium pour hommes et femmes',
    currency: 'XOF',
    // Produits : chaussures, sneakers, boots, sandales
    categories: ['sneakers', 'boots', 'sandales', 'formal', 'sport', 'accessories'],
  },
  wellness: {
    id: process.env.NEXT_PUBLIC_STORE_ID_WELLNESS || '',
    name: 'omen-wellness',
    displayName: 'oMen Wellness',
    domain: 'omenwellness.com',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    description: 'Produits de bien-être et self-care',
    currency: 'XOF',
    // Produits : skincare, huiles, compléments, accessoires bien-être
    categories: ['skincare', 'huiles-essentielles', 'complements', 'accessories', 'coffrets'],
  },
} as const;

export type StoreName = keyof typeof STORES;
