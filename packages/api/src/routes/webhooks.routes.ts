import { Router, Request, Response } from 'express';
import { getGeniusPay } from '../services/geniuspay.service';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/webhooks/geniuspay — Webhook GeniusPay
router.post('/geniuspay', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-geniuspay-signature'] as string;
    const timestamp = req.headers['x-geniuspay-timestamp'] as string;

    if (!signature || !timestamp) {
      return res.status(401).json({ error: 'Missing signature headers' });
    }

    const geniusPay = getGeniusPay();
    const rawBody = JSON.stringify(req.body);

    // Vérifier la signature
    if (!geniusPay.verifyWebhookSignature(timestamp, rawBody, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Vérifier le timestamp (anti-replay)
    if (!geniusPay.isWebhookTimestampValid(timestamp)) {
      return res.status(400).json({ error: 'Timestamp expired' });
    }

    const { event, data } = req.body;

    // Logger l'événement
    await prisma.paymentLog.create({
      data: {
        orderId: '', // Sera mis à jour si la référence existe
        reference: data.reference,
        event,
        payload: req.body,
      },
    });

    // Trouver la commande
    const order = await prisma.order.findFirst({
      where: { reference: data.reference },
    });

    if (!order) {
      console.warn(`Order not found for reference: ${data.reference}`);
      return res.status(200).json({ received: true });
    }

    // Traiter selon l'événement
    switch (event) {
      case 'payment.success': {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PROCESSING',
            paymentMethod: data.payment_method || order.paymentMethod,
          },
        });
        console.log(`Order ${order.id} marked as PROCESSING`);
        break;
      }

      case 'payment.completed': {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PROCESSING' },
        });
        console.log(`Order ${order.id} payment completed`);
        break;
      }

      case 'payment.failed': {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'CANCELLED' },
        });
        console.log(`Order ${order.id} payment failed`);
        break;
      }

      case 'payment.refunded': {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'REFUNDED' },
        });
        console.log(`Order ${order.id} refunded`);
        break;
      }

      default:
        console.log(`Unhandled event: ${event}`);
    }

    // Toujours répondre 200 pour confirmer la réception
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
