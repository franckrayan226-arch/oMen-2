import { Router, Request, Response } from 'express';
import { getGeniusPay, CreatePaymentParams } from '../services/geniuspay.service';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/payments/create — Créer un paiement
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

    const shipping = 0; // Configurable par store
    const total = subtotal + shipping;

    // 3. Créer la commande (statut PENDING)
    const order = await prisma.order.create({
      data: {
        store: { connect: { id: storeId } },
        subtotal,
        shipping,
        total,
        currency: 'XOF',
        shippingAddress: shippingAddress || undefined,
        notes,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    // 4. Appeler GeniusPay
    const geniusPay = getGeniusPay();
    const payment = await geniusPay.createPayment({
      amount: total,
      currency: 'XOF',
      description: `Commande ${store.displayName} #${order.id.slice(-8).toUpperCase()}`,
      customer: {
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
      },
      metadata: {
        order_id: order.id,
        store_id: storeId,
        store_name: store.name,
      },
      successUrl: `${process.env.FRONTEND_URL}/${store.name}/order-success?ref={reference}`,
      errorUrl: `${process.env.FRONTEND_URL}/${store.name}/checkout?error=payment_failed`,
    });

    // 5. Mettre à jour la commande avec la référence GeniusPay
    await prisma.order.update({
      where: { id: order.id },
      data: {
        reference: payment.data.reference,
        paymentMethod: payment.data.payment_method || null,
      },
    });

    // 6. Logger le paiement
    await prisma.paymentLog.create({
      data: {
        orderId: order.id,
        reference: payment.data.reference,
        event: 'payment.created',
        payload: payment.data as any,
      },
    });

    return res.json({
      success: true,
      checkoutUrl: payment.data.checkout_url || payment.data.payment_url,
      reference: payment.data.reference,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error('Payment creation error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Payment creation failed' });
  }
});

// GET /api/payments/:reference — Vérifier le statut d'un paiement
router.get('/:reference', async (req: Request, res: Response) => {
  try {
    const geniusPay = getGeniusPay();
    const payment = await geniusPay.getPayment(req.params.reference);

    // Sync le statut en DB
    if (payment.success) {
      const statusMap: Record<string, string> = {
        completed: 'PROCESSING',
        failed: 'CANCELLED',
      };
      const newStatus = statusMap[payment.data.status];

      if (newStatus) {
        await prisma.order.updateMany({
          where: { reference: req.params.reference },
          data: { status: newStatus as any },
        });
      }
    }

    return res.json(payment);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

export default router;
