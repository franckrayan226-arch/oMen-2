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