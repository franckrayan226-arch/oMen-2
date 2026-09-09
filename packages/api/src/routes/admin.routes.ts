import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'omen2026-secret';

// POST /api/admin/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { user, pass } = req.body;

    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: user },
          { name: user },
        ],
      },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const valid = await bcrypt.compare(pass, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/logout
router.post('/logout', async (_req: Request, res: Response) => {
  return res.json({ success: true });
});

// POST /api/admin/create — Créer un admin (à exécuter une seule fois)
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Cet email existe déjà' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await prisma.adminUser.create({
      data: {
        email,
        password: hashed,
        name,
        role: role || 'ADMIN',
      },
    });

    return res.status(201).json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/me — Profil admin connecté
router.get('/me', async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as any;
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Admin introuvable' });
    }

    return res.json(admin);
  } catch (error: any) {
    return res.status(401).json({ error: 'Token invalide' });
  }
});

export default router;