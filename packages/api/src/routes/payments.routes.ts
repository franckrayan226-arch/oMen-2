import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/payments/create — Créer une commande (paiement à la livraison)
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { storeId, items, customer, shippingAddress, notes } = req.body;

    if (!storeId || !items?.length) {
      return res.status(400).json({ error: 'storeId and items required' });
    }

    // 1. Vérifier le store
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store || !store.active) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // 2. Calculer le total depuis les produits DB (jamais côté client)
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, storeId, active: true },
    });

    if (products.length !== items.length) {
      return res.status(400).json({ error: 'Some products not found' });
    }

    let subtotal = 0;
    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId)!;
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const shipping = 0;
    const total = subtotal + shipping;

    // 3. Créer la commande (statut CONFIRMED — paiement à la livraison)
    const order = await prisma.order.create({
      data: {
        store: { connect: { id: storeId } },
        subtotal,
        shipping,
        total,
        currency: 'XOF',
        paymentMethod: 'COD',
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : undefined,
        notes: customer?.phone ? `Tél: ${customer.phone}${customer.email ? ` — Email: ${customer.email}` : ''}${notes ? ` — ${notes}` : ''}` : notes,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    return res.json({
      success: true,
      orderId: order.id,
      reference: `ORD-${order.id.slice(-8).toUpperCase()}`,
      redirectUrl: null,
    });
  } catch (error: any) {
    const details = error.response?.data || error.message || error;
    console.error('Order creation error:', JSON.stringify(details));
    return res.status(500).json({ error: 'Order creation failed', details: typeof details === 'string' ? details : JSON.stringify(details) });
  }
});

// GET /api/payments/:reference — Récupérer une commande
router.get('/:reference', async (req: Request, res: Response) => {
  try {
    const reference = req.params.reference;
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: reference }, { reference }] },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
