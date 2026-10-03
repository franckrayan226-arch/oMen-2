import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const normStore = (v: string) =>
  v === 'shoes' ? 'omen-shoes' : v === 'wellness' ? 'omen-wellness' : v === 'tech' ? 'omen-tech' : v;

// Code : 6 caractères, alphabet sans lettres ambiguës (0/O/1/I/L)
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
function genCode(): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}
async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const c = genCode();
    const exists = await prisma.partner.findUnique({ where: { code: c } });
    if (!exists) return c;
  }
  throw new Error('Code generation failed');
}

// POST /api/partners — adhésion publique : génère le code unique
router.post('/', async (req: Request, res: Response) => {
  try {
    const { storeId, name, phone, handle } = req.body;
    if (!storeId || !name?.trim()) {
      return res.status(400).json({ error: 'storeId et name sont requis' });
    }
    const code = await uniqueCode();
    const partner = await prisma.partner.create({
      data: {
        storeId: normStore(storeId),
        name: name.trim(),
        phone: phone?.trim() || null,
        handle: handle?.trim() || null,
        code,
      },
    });
    return res.status(201).json(partner);
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Code déjà utilisé, réessayez' });
    return res.status(500).json({ error: 'Failed to create partner' });
  }
});

// GET /api/partners/config?storeId= — publique (landing page)
router.get('/config', async (req: Request, res: Response) => {
  try {
    const raw = (req.query.storeId as string) || (req.query.site as string) || 'omen-shoes';
    const store = await prisma.store.findUnique({
      where: { id: normStore(raw) },
      select: { partnerDiscountPct: true, partnerCommissionPct: true },
    });
    if (!store) return res.status(404).json({ error: 'Store not found' });
    return res.json({ discountPct: store.partnerDiscountPct, commissionPct: store.partnerCommissionPct });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// PUT /api/partners/config — dashboard : % globaux
router.put('/config', async (req: Request, res: Response) => {
  try {
    const { storeId, discountPct, commissionPct } = req.body;
    if (!storeId) return res.status(400).json({ error: 'storeId requis' });
    const data: any = {};
    if (discountPct !== undefined) {
      const v = Number(discountPct);
      if (!Number.isFinite(v) || v < 0 || v > 100) return res.status(400).json({ error: 'discountPct invalide' });
      data.partnerDiscountPct = Math.round(v);
    }
    if (commissionPct !== undefined) {
      const v = Number(commissionPct);
      if (!Number.isFinite(v) || v < 0 || v > 100) return res.status(400).json({ error: 'commissionPct invalide' });
      data.partnerCommissionPct = Math.round(v);
    }
    const store = await prisma.store.update({ where: { id: normStore(storeId) }, data });
    return res.json({ discountPct: store.partnerDiscountPct, commissionPct: store.partnerCommissionPct });
  } catch {
    return res.status(500).json({ error: 'Failed to update config' });
  }
});

// POST /api/partners/validate — checkout : vérifie un code pour un panier
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { storeId, code, subtotal } = req.body;
    if (!storeId || !code?.toString().trim()) {
      return res.json({ valid: false, error: 'Code requis' });
    }
    const partner = await prisma.partner.findUnique({
      where: { code: code.toString().trim().toUpperCase() },
    });
    if (!partner || partner.storeId !== normStore(storeId) || !partner.active) {
      return res.json({ valid: false, error: 'Code invalide ou inactif' });
    }
    const store = await prisma.store.findUnique({ where: { id: partner.storeId } });
    const pct = store?.partnerDiscountPct ?? 0;
    const sub = Number(subtotal) || 0;
    const discount = sub > 0 ? Math.round((sub * pct) / 100) : 0;
    return res.json({ valid: true, discountPct: pct, discount });
  } catch {
    return res.status(500).json({ error: 'Failed to validate code' });
  }
});

// GET /api/partners?storeId= — dashboard : liste + stats par code
router.get('/', async (req: Request, res: Response) => {
  try {
    const raw = (req.query.storeId as string) || (req.query.site as string);
    const where: any = {};
    if (raw) where.storeId = normStore(raw);

    const partners = await prisma.partner.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          select: {
            id: true,
            discount: true,
            commission: true,
            createdAt: true,
            items: { select: { quantity: true } },
          },
        },
      },
    });

    const data = partners.map((p) => {
      const orders = p.orders;
      const itemCount = orders.reduce((sum, o) => sum + o.items.reduce((a, i) => a + i.quantity, 0), 0);
      const discountTotal = orders.reduce((sum, o) => sum + o.discount, 0);
      const commissionTotal = orders.reduce((sum, o) => sum + o.commission, 0);
      const lastUsed = orders.length
        ? orders.reduce((max, o) => (o.createdAt > max ? o.createdAt : max), orders[0].createdAt)
        : null;
      return {
        id: p.id,
        storeId: p.storeId,
        name: p.name,
        phone: p.phone,
        handle: p.handle,
        code: p.code,
        active: p.active,
        createdAt: p.createdAt,
        ordersCount: orders.length,
        itemCount,
        discountTotal,
        commissionTotal,
        lastUsed,
      };
    });

    return res.json({ data });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// GET /api/partners/:id/orders — détail : quelles ventes, quels articles, quel client
router.get('/:id/orders', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { partnerId: req.params.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    const data = orders.map((o) => {
      let customer: any = {};
      try { customer = o.shippingAddress ? JSON.parse(o.shippingAddress) : {}; } catch {}
      return {
        id: o.id,
        reference: o.reference,
        createdAt: o.createdAt,
        status: o.status,
        subtotal: o.subtotal,
        total: o.total,
        discount: o.discount,
        commission: o.commission,
        customerName: customer.name || null,
        customerPhone: customer.phone || null,
        items: o.items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      };
    });
    return res.json({ data });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch partner orders' });
  }
});

// PATCH /api/partners/:id — actif/inactif, édition
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { active, name, phone, handle } = req.body;
    const data: any = {};
    if (active !== undefined) data.active = !!active;
    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ error: 'Le nom est requis' });
      data.name = String(name).trim();
    }
    if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
    if (handle !== undefined) data.handle = handle ? String(handle).trim() : null;
    const partner = await prisma.partner.update({ where: { id: req.params.id }, data });
    return res.json(partner);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Partner not found' });
    return res.status(500).json({ error: 'Failed to update partner' });
  }
});

// DELETE /api/partners/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Les commandes gardent leur historique (partnerId → null, codes restent lisibles)
    await prisma.order.updateMany({ where: { partnerId: req.params.id }, data: { partnerId: null } });
    await prisma.notification.updateMany({ where: { partnerId: req.params.id }, data: { partnerId: null } });
    await prisma.partner.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Partner not found' });
    return res.status(500).json({ error: 'Failed to delete partner' });
  }
});

export default router;
