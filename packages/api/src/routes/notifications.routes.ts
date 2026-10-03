import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const normStore = (v: string) =>
  v === 'shoes' ? 'omen-shoes' : v === 'wellness' ? 'omen-wellness' : v === 'tech' ? 'omen-tech' : v;

// GET /api/notifications?storeId= — liste récente + compteur non-lus
router.get('/', async (req: Request, res: Response) => {
  try {
    const raw = (req.query.storeId as string) || (req.query.site as string);
    const where: any = {};
    if (raw) where.storeId = normStore(raw);

    const [data, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { partner: { select: { name: true, code: true } } },
      }),
      prisma.notification.count({ where: { ...where, read: false } }),
    ]);

    return res.json({ data, unreadCount });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/read-all — tout marquer comme lu
router.patch('/read-all', async (req: Request, res: Response) => {
  try {
    const { storeId } = req.body;
    const where: any = { read: false };
    if (storeId) where.storeId = normStore(storeId);
    await prisma.notification.updateMany({ where, data: { read: true } });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Failed to mark notifications' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const n = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    return res.json(n);
  } catch {
    return res.status(500).json({ error: 'Failed to mark notification' });
  }
});

export default router;
