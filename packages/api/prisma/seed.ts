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

  // 1bis. Produits oMen Tech (images Cloudinary)
  const techProducts = [
    { slug: 'iphone-15-128-go', name: 'iPhone 15 128 Go', category: 'Smartphones', brand: 'iPhone', price: 780000, compareAt: 850000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965820/omen-tech/rxm3uv7izty4rzbsnyfq.jpg', description: "L'iPhone 15 avec puce A16 Bionic, écran Super Retina XDR 6,1\" et capteur 48 Mpx. Livré avec garantie 12 mois.", featured: true },
    { slug: 'samsung-galaxy-s24', name: 'Samsung Galaxy S24 5G', category: 'Smartphones', brand: 'Samsung', price: 545000, compareAt: 599000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971054/omen-tech/xmxtcb913kcjyznaajgm.jpg', description: "Galaxy S24 5G, écran AMOLED 120 Hz, triple capteur photo et 256 Go de stockage. Compatible 5G.", featured: true },
    { slug: 'macbook-air-m2', name: 'MacBook Air M2 13"', category: 'Ordinateurs', brand: 'Apple', price: 890000, compareAt: 950000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965823/omen-tech/s9rm2qghftuc89fb1gkf.jpg', description: "MacBook Air avec puce M2, 8 Go de RAM et SSD 256 Go. Ultra-fin, jusqu'à 18h d'autonomie.", featured: true },
    { slug: 'ecran-bureau-27', name: 'Écran bureau 27" QHD', category: 'Ordinateurs', brand: 'Dell', price: 165000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965824/omen-tech/ps4zjozzsh5itre3arh6.jpg', description: "Écran 27 pouces QHD IPS, 75 Hz, sans fil (HDMI + DisplayPort). Idéal travail et multimédia.", featured: false },
    { slug: 'casque-anc-pro', name: 'Casque Bluetooth ANC Pro', category: 'Audio', brand: 'JBL', price: 45000, compareAt: 59000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971058/omen-tech/iti0ub8ph6qh2lzj8hfh.jpg', description: "Casque circum-aural sans fil avec réduction de bruit active, 40h d'autonomie et Bluetooth 5.3.", featured: true },
    { slug: 'ecouteurs-sans-fil-pro', name: 'Écouteurs sans fil Pro', category: 'Audio', brand: 'Anker', price: 25000, compareAt: 32000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971057/omen-tech/an2easythp0xwq8gr8zw.jpg', description: "True Wireless avec boîtier de charge, appel main libre et résistance à l'eau IPX5.", featured: true },
    { slug: 'enceinte-bluetooth-mini', name: 'Enceinte Bluetooth Mini', category: 'Audio', brand: 'Sony', price: 35000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965827/omen-tech/os2kgvyjtkala09pnuv3.jpg', description: "Enceinte portable étanche, son 360° et 12h d'autonomie. Emportez-la partout.", featured: false },
    { slug: 'montre-connectee-fit', name: 'Montre connectée Fit', category: 'Montres', brand: 'Xiaomi', price: 52000, compareAt: 65000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971055/omen-tech/tmzlspjbiwgv1famj8mp.jpg', description: "Suivi d'activité, fréquence cardiaque, GPS et notifications. Autonomie 7 jours.", featured: false },
    { slug: 'tablette-10-9', name: 'Tablette 10.9" 128 Go', category: 'Tablettes', brand: 'Lenovo', price: 215000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965829/omen-tech/gzyqkmujncmszyohqy6m.jpg', description: "Tablette 10.9 pouces Full HD, 128 Go, Wi-Fi et batterie 10h. Parfaite pour le divertissement.", featured: false },
    { slug: 'clavier-mecanique-rgb', name: 'Clavier mécanique RGB', category: 'Accessoires', brand: 'Baseus', price: 38000, compareAt: 45000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965821/omen-tech/ypxsy0692nnbnrfqw6yg.jpg', description: "Clavier mécanique rétroéclairé, switches bleues et pavé numérique. USB-C détachable.", featured: false },
    { slug: 'manette-gameplay', name: 'Manette Gameplay sans fil', category: 'Accessoires', brand: 'Microsoft', price: 32000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790971060/omen-tech/i5esshqogrqveqgqau3a.jpg', description: "Manette ergonomique Bluetooth/USB, vibrations doubles et autonomie 20h.", featured: false },
    { slug: 'appareil-photo-compact', name: 'Appareil photo compact 24 Mpx', category: 'Accessoires', brand: 'Canon', price: 265000, image: 'https://res.cloudinary.com/ne1zesia/image/upload/v1790965811/omen-tech/cuoti7nvhhwry1snjmoi.jpg', description: "Appareil photo 24 Mpx avec zoom optique, vidéo Full HD et écran orientable.", featured: false },
  ];

  for (const p of techProducts) {
    const seeded = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { brand: p.brand },
      create: {
        storeId: 'omen-tech',
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAt: p.compareAt ?? null,
        category: p.category,
        brand: p.brand,
        active: true,
        featured: p.featured,
        images: {
          create: [{ url: p.image, alt: p.name, isMain: true, sortOrder: 0 }],
        },
      },
    });
    // Synchronise l'image principale (les upserts ne touchent pas les relations)
    await prisma.productImage.updateMany({
      where: { productId: seeded.id, isMain: true },
      data: { url: p.image },
    });
  }
  console.log(`Produits oMen Tech: ${techProducts.length}`);

  // 1ter. Catégories oMen Tech (mur de briques home + onglets catalogue)
  const techCategories = [
    { name: 'Smartphones', image: 'https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790970067/omen-tech/cm8cj6jxylswg0h6dakf.jpg' },
    { name: 'Ordinateurs', image: 'https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790970063/omen-tech/qk1te1akhbgpziqfv6kb.jpg' },
    { name: 'Audio', image: 'https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790970071/omen-tech/xbnxm1d60jmckcxlnxiy.jpg' },
    { name: 'Tablettes', image: 'https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790970069/omen-tech/ibgj8fdmt1bgaiwregrg.jpg' },
    { name: 'Montres', image: 'https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790971055/omen-tech/tmzlspjbiwgv1famj8mp.jpg' },
    { name: 'Accessoires', image: 'https://res.cloudinary.com/ne1zesia/image/upload/f_auto,q_auto,w_600/v1790971060/omen-tech/i5esshqogrqveqgqau3a.jpg' },
  ];
  for (let i = 0; i < techCategories.length; i++) {
    const c = techCategories[i];
    await prisma.category.upsert({
      where: { storeId_name: { storeId: 'omen-tech', name: c.name } },
      // Pas de sortOrder dans update : on ne réordonne pas ce qui est géré depuis le dashboard
      update: { image: c.image },
      create: { storeId: 'omen-tech', name: c.name, image: c.image, sortOrder: i },
    });
  }
  console.log(`Catégories oMen Tech: ${techCategories.length}`);

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