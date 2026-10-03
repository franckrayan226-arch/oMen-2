import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const normStore = (v: string) =>
  v === 'shoes' ? 'omen-shoes' : v === 'wellness' ? 'omen-wellness' : v === 'tech' ? 'omen-tech' : v;

// GET /api/categories?storeId=xxx — publique : catégories actives d'une boutique
router.get('/', async (req: Request, res: Response) => {
  try {
    const { storeId, site, includeInactive } = req.query;

    const where: any = {};
    if (includeInactive !== '1') where.active = true;
    const storeFilter = (site as string) || (storeId as string);
    if (storeFilter) where.storeId = normStore(storeFilter as string);

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return res.json({ data: categories });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories — créer une catégorie (dashboard)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { storeId, name, image = '', sortOrder = 0 } = req.body;
    if (!storeId || !name?.trim()) {
      return res.status(400).json({ error: 'storeId et name sont requis' });
    }

    const category = await prisma.category.create({
      data: { storeId: normStore(storeId), name: name.trim(), image, sortOrder: Number(sortOrder) || 0 },
    });
    return res.status(201).json(category);
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Cette catégorie existe déjà' });
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id — modifier (dashboard)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, image, sortOrder, active } = req.body;
    const data: any = {};
    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ error: 'Le nom est requis' });
      data.name = String(name).trim();
    }
    if (image !== undefined) data.image = image;
    if (sortOrder !== undefined) data.sortOrder = Number(sortOrder) || 0;
    if (active !== undefined) data.active = !!active;

    const category = await prisma.category.update({ where: { id: req.params.id }, data });
    return res.json(category);
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Cette catégorie existe déjà' });
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    return res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id — supprimer (dashboard)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    return res.json({ ok: true });
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    return res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
