import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/dashboard/stats — Statistiques globales
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { storeId, period = '30d' } = req.query;

    const now = new Date();
    const startDate = new Date();
    switch (period) {
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
      case '90d': startDate.setDate(now.getDate() - 90); break;
      default: startDate.setDate(now.getDate() - 30);
    }

    const where: any = { createdAt: { gte: startDate } };
    if (storeId) where.storeId = storeId as string;

    const [
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders,
      topProducts,
      ordersByStore,
    ] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({ where, _sum: { total: true } }),
      prisma.order.groupBy({ by: ['status'], where, _count: true }),
      prisma.order.findMany({
        where,
        include: { store: { select: { name: true, displayName: true } }, items: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: { order: where },
        _sum: { quantity: true },
        _count: true,
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
      prisma.order.groupBy({
        by: ['storeId'],
        where,
        _count: true,
        _sum: { total: true },
      }),
    ]);

    return res.json({
      summary: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        averageOrderValue: totalOrders > 0
          ? Math.round((totalRevenue._sum.total || 0) / totalOrders)
          : 0,
      },
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      ordersByStore: ordersByStore.map((s) => ({
        storeId: s.storeId,
        count: s._count,
        revenue: s._sum.total || 0,
      })),
      recentOrders,
      topProducts,
      period,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/dashboard/revenue — Revenus par jour
router.get('/revenue', async (req: Request, res: Response) => {
  try {
    const { storeId, days = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const where: any = {
      createdAt: { gte: startDate },
      status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] },
    };
    if (storeId) where.storeId = storeId as string;

    const orders = await prisma.order.findMany({
      where,
      select: { total: true, createdAt: true },
    });

    // Grouper par jour
    const revenueByDay: Record<string, number> = {};
    orders.forEach((order) => {
      const day = order.createdAt.toISOString().split('T')[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
    });

    return res.json({ data: revenueByDay });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch revenue' });
  }
});

export default router;
