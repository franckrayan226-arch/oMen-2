# oMen 2 — Architecture Monorepo

## Vue d'ensemble

```
omen2/
├── apps/
│   ├── omen-shoes/          # Site e-commerce chaussures (Next.js)
│   ├── omen-wellness/       # Site produits bien-être (Next.js)
│   └── dashboard/           # Dashboard administrateur (Next.js)
├── packages/
│   ├── api/                 # Backend API unique (Express + Prisma)
│   ├── shared/              # Types, constants, utils partagés
│   └── ui/                  # Composants UI communs (React)
└── prisma/                  # Schema DB unifié
```

## Stack Technique

| Couche     | Technologie                        |
| ---------- | ---------------------------------- |
| Frontend   | Next.js 14+ (App Router)           |
| Backend    | Express.js + TypeScript            |
| Database   | PostgreSQL + Prisma ORM            |
| Payments   | GeniusPay API (Mobile Money + CB)  |
| Auth       | JWT + Refresh Tokens               |
| State      | Zustand (frontend)                 |
| Styling    | Tailwind CSS                       |
| Monorepo   | Turborepo                          |

## Flux de Paiement GeniusPay

```
Client → Site (omen-shoes ou omen-wellness)
  → POST /api/payments/create { amount, customer, metadata }
    → Backend crée le paiement via GeniusPay API
      → Retourne checkout_url
        → Client redirigé vers GeniusPay Checkout
          → Webhook reçu par /api/webhooks/geniuspay
            → Backend met à jour le statut de la commande
              → Confirmation affichée au client
```

## Déploiement

- **Frontends** : Vercel (3 apps séparées)
- **Backend** : Railway / Render
- **Database** : Supabase / Neon (PostgreSQL managed)
- **Domaines** :
  - `omenshoes.com` → omen-shoes
  - `omenwellness.com` → omen-wellness
  - `admin.omen2.com` → dashboard
  - `api.omen2.com` → backend
