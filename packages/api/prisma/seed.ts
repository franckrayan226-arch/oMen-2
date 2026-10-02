import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Créer les boutiques
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

  console.log('Boutiques créées: omen-shoes, omen-wellness, omen-tech');

  // 1bis. Produits oMen Tech (images locales du front: /tech/*.jpg)
  const techProducts = [
    { slug: 'iphone-15-128-go', name: 'iPhone 15 128 Go', category: 'Smartphones', price: 780000, compareAt: 850000, image: '/tech/iphone.jpg', description: "L'iPhone 15 avec puce A16 Bionic, écran Super Retina XDR 6,1\" et capteur 48 Mpx. Livré avec garantie 12 mois.", featured: true },
    { slug: 'samsung-galaxy-s24', name: 'Samsung Galaxy S24 5G', category: 'Smartphones', price: 545000, compareAt: 599000, image: '/tech/phone.jpg', description: "Galaxy S24 5G, écran AMOLED 120 Hz, triple capteur photo et 256 Go de stockage. Compatible 5G.", featured: true },
    { slug: 'macbook-air-m2', name: 'MacBook Air M2 13"', category: 'Ordinateurs', price: 890000, compareAt: 950000, image: '/tech/laptop.jpg', description: "MacBook Air avec puce M2, 8 Go de RAM et SSD 256 Go. Ultra-fin, jusqu'à 18h d'autonomie.", featured: true },
    { slug: 'ecran-bureau-27', name: 'Écran bureau 27" QHD', category: 'Ordinateurs', price: 165000, image: '/tech/monitor.jpg', description: "Écran 27 pouces QHD IPS, 75 Hz, sans fil (HDMI + DisplayPort). Idéal travail et multimédia.", featured: false },
    { slug: 'casque-anc-pro', name: 'Casque Bluetooth ANC Pro', category: 'Audio', price: 45000, compareAt: 59000, image: '/tech/headphones.jpg', description: "Casque circum-aural sans fil avec réduction de bruit active, 40h d'autonomie et Bluetooth 5.3.", featured: true },
    { slug: 'ecouteurs-sans-fil-pro', name: 'Écouteurs sans fil Pro', category: 'Audio', price: 25000, compareAt: 32000, image: '/tech/earbuds.jpg', description: "True Wireless avec boîtier de charge, appel main libre et résistance à l'eau IPX5.", featured: true },
    { slug: 'enceinte-bluetooth-mini', name: 'Enceinte Bluetooth Mini', category: 'Audio', price: 35000, image: '/tech/speaker.jpg', description: "Enceinte portable étanche, son 360° et 12h d'autonomie. Emportez-la partout.", featured: false },
    { slug: 'montre-connectee-fit', name: 'Montre connectée Fit', category: 'Montres', price: 52000, compareAt: 65000, image: '/tech/watch.jpg', description: "Suivi d'activité, fréquence cardiaque, GPS et notifications. Autonomie 7 jours.", featured: false },
    { slug: 'tablette-10-9', name: 'Tablette 10.9" 128 Go', category: 'Tablettes', price: 215000, image: '/tech/tablet.jpg', description: "Tablette 10.9 pouces Full HD, 128 Go, Wi-Fi et batterie 10h. Parfaite pour le divertissement.", featured: false },
    { slug: 'clavier-mecanique-rgb', name: 'Clavier mécanique RGB', category: 'Accessoires', price: 38000, compareAt: 45000, image: '/tech/keyboard.jpg', description: "Clavier mécanique rétroéclairé, switches bleues et pavé numérique. USB-C détachable.", featured: false },
    { slug: 'manette-gameplay', name: 'Manette Gameplay sans fil', category: 'Accessoires', price: 32000, image: '/tech/gaming.jpg', description: "Manette ergonomique Bluetooth/USB, vibrations doubles et autonomie 20h.", featured: false },
    { slug: 'appareil-photo-compact', name: 'Appareil photo compact 24 Mpx', category: 'Accessoires', price: 265000, image: '/tech/camera.jpg', description: "Appareil photo 24 Mpx avec zoom optique, vidéo Full HD et écran orientable.", featured: false },
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

  // 2. Créer l'admin (connexion par nom d'utilisateur: admin)
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
    console.log('Admin créé: admin / omen2026');
  } else {
    if (existing.username !== 'admin') {
      await prisma.adminUser.update({
        where: { id: existing.id },
        data: { username: 'admin' },
      });
      console.log('Username "admin" assigné');
    } else {
      console.log('Admin déjà existant');
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());