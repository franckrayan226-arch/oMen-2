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

  console.log('Boutiques créées: omen-shoes, omen-wellness');

  // 2. Créer l'admin
  const existing = await prisma.adminUser.findUnique({ where: { email: 'admin@omen.tg' } });
  if (!existing) {
    const hashed = await bcrypt.hash('omen2026', 10);
    await prisma.adminUser.create({
      data: {
        email: 'admin@omen.tg',
        password: hashed,
        name: 'Admin',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('Admin créé: admin@omen.tg / omen2026');
  } else {
    console.log('Admin déjà existant');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());