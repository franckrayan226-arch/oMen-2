import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. CrÃ©er les boutiques
  await prisma.store.upsert({
    where: { id: 'omen-shoes' },
    update: {},
    create: {
      id: 'omen-shoes',
      name: 'omen-shoes',
      displayName: 'oMen Shoes',
      domain: 'omenshoes.com',
      active: true,
    },
  });

  await prisma.store.upsert({
    where: { id: 'omen-wellness' },
    update: {},
    create: {
      id: 'omen-wellness',
      name: 'omen-wellness',
      displayName: 'oMen Wellness',
      domain: 'omenwellness.com',
      active: true,
    },
  });

  await prisma.store.upsert({
    where: { id: 'omen-tech' },
    update: {},
    create: {
      id: 'omen-tech',
      name: 'omen-tech',
      displayName: 'oMen Tech',
      domain: 'omentech.com',
      active: true,
    },
  });

  console.log('Boutiques crÃ©Ã©es: omen-shoes, omen-wellness, omen-tech');

  // 1bis. Produits oMen Tech (images locales du front: /tech/*.jpg)
  const techProducts = [
    { slug: 'iphone-15-128-go', name: 'iPhone 15 128 Go', category: 'Smartphones', price: 780000, compareAt: 850000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965820/omen-tech/rxm3uv7izty4rzbsnyfq.jpg', description: "L'iPhone 15 avec puce A16 Bionic, Ã©cran Super Retina XDR 6,1\" et capteur 48 Mpx. LivrÃ© avec garantie 12 mois.", featured: true },
    { slug: 'samsung-galaxy-s24', name: 'Samsung Galaxy S24 5G', category: 'Smartphones', price: 545000, compareAt: 599000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971058/omen-tech/iti0ub8ph6qh2lzj8hfh.jpg', description: "Galaxy S24 5G, Ã©cran AMOLED 120 Hz, triple capteur photo et 256 Go de stockage. Compatible 5G.", featured: true },
    { slug: 'macbook-air-m2', name: 'MacBook Air M2 13"', category: 'Ordinateurs', price: 890000, compareAt: 950000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965816/omen-tech/gutjf5iekx0j1bkon5si.jpg', description: "MacBook Air avec puce M2, 8 Go de RAM et SSD 256 Go. Ultra-fin, jusqu'Ã  18h d'autonomie.", featured: true },
    { slug: 'ecran-bureau-27', name: 'Ã‰cran bureau 27" QHD', category: 'Ordinateurs', price: 165000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965824/omen-tech/ps4zjozzsh5itre3arh6.jpg', description: "Ã‰cran 27 pouces QHD IPS, 75 Hz, sans fil (HDMI + DisplayPort). IdÃ©al travail et multimÃ©dia.", featured: false },
    { slug: 'casque-anc-pro', name: 'Casque Bluetooth ANC Pro', category: 'Audio', price: 45000, compareAt: 59000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790970067/omen-tech/cm8cj6jxylswg0h6dakf.jpg', description: "Casque circum-aural sans fil avec rÃ©duction de bruit active, 40h d'autonomie et Bluetooth 5.3.", featured: true },
    { slug: 'ecouteurs-sans-fil-pro', name: 'Ã‰couteurs sans fil Pro', category: 'Audio', price: 25000, compareAt: 32000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971057/omen-tech/an2easythp0xwq8gr8zw.jpg', description: "True Wireless avec boÃ®tier de charge, appel main libre et rÃ©sistance Ã  l'eau IPX5.", featured: true },
    { slug: 'enceinte-bluetooth-mini', name: 'Enceinte Bluetooth Mini', category: 'Audio', price: 35000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965827/omen-tech/os2kgvyjtkala09pnuv3.jpg', description: "Enceinte portable Ã©tanche, son 360Â° et 12h d'autonomie. Emportez-la partout.", featured: false },
    { slug: 'montre-connectee-fit', name: 'Montre connectÃ©e Fit', category: 'Montres', price: 52000, compareAt: 65000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971055/omen-tech/tmzlspjbiwgv1famj8mp.jpg', description: "Suivi d'activitÃ©, frÃ©quence cardiaque, GPS et notifications. Autonomie 7 jours.", featured: false },
    { slug: 'tablette-10-9', name: 'Tablette 10.9" 128 Go', category: 'Tablettes', price: 215000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965829/omen-tech/gzyqkmujncmszyohqy6m.jpg', description: "Tablette 10.9 pouces Full HD, 128 Go, Wi-Fi et batterie 10h. Parfaite pour le divertissement.", featured: false },
    { slug: 'clavier-mecanique-rgb', name: 'Clavier mÃ©canique RGB', category: 'Accessoires', price: 38000, compareAt: 45000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971054/omen-tech/xmxtcb913kcjyznaajgm.jpg', description: "Clavier mÃ©canique rÃ©troÃ©clairÃ©, switches bleues et pavÃ© numÃ©rique. USB-C dÃ©tachable.", featured: false },
    { slug: 'manette-gameplay', name: 'Manette Gameplay sans fil', category: 'Accessoires', price: 32000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965815/omen-tech/bsvynbrq4y3fq38vj09o.jpg', description: "Manette ergonomique Bluetooth/USB, vibrations doubles et autonomie 20h.", featured: false },
    { slug: 'appareil-photo-compact', name: 'Appareil photo compact 24 Mpx', category: 'Accessoires', price: 265000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965811/omen-tech/cuoti7nvhhwry1snjmoi.jpg', description: "Appareil photo 24 Mpx avec zoom optique, vidÃ©o Full HD et Ã©cran orientable.", featured: false },
  ];

  for (const p of techProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        storeId: 'omen-tech',
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAt: p.compareAt ?? null,
        category: p.category,
        active: true,
        featured: p.featured,
        images: {
          create: [{ url: p.image, alt: p.name, isMain: true, sortOrder: 0 }],
        },
      },
    });
  }
  console.log(`Produits oMen Tech: ${techProducts.length}`);

  // 2. CrÃ©er l'admin (connexion par nom d'utilisateur: admin)
  const existing = await prisma.adminUser.findUnique({ where: { email: 'admin@omen.tg' } });
  if (!existing) {
    const hashed = await bcrypt.hash('omen2026', 10);
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        email: 'admin@omen.tg',
        password: hashed,
        name: 'Admin',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('Admin crÃ©Ã©: admin / omen2026');
  } else {
    if (existing.username !== 'admin') {
      await prisma.adminUser.update({
        where: { id: existing.id },
        data: { username: 'admin' },
      });
      console.log('Username "admin" assignÃ©');
    } else {
      console.log('Admin dÃ©jÃ  existant');
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());