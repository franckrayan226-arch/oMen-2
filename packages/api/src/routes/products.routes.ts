import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/products?storeId=xxx&category=xxx
router.get('/', async (req: Request, res: Response) => {
  try {
    const { storeId, site, category, featured, page = '1', limit = '20', search, includeInactive } = req.query;

    const where: any = {};
    if (includeInactive !== '1') where.active = true;
    const storeFilter = (site as string) || (storeId as string);
    if (storeFilter) where.storeId = storeFilter === 'shoes' ? 'omen-shoes' : storeFilter === 'wellness' ? 'omen-wellness' : storeFilter === 'tech' ? 'omen-tech' : storeFilter;
    if (category) where.category = category as string;
    if (featured === 'true') where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
        include: {
          colors: { include: { images: true } },
          images: true,
          variants: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      data: products,
      meta: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/admin/:id — Admin product detail (includes inactive)
router.get('/admin/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        colors: { include: { images: true }, orderBy: { sortOrder: 'asc' } },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: [{ colorId: 'asc' }, { size: 'asc' }] },
      },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET /api/products/:slug — Public product detail
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug, active: true },
      include: {
        colors: { include: { images: true } },
        images: true,
        variants: { where: { active: true } },
      },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products — Créer un produit (Dashboard)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      storeId,
      name,
      slug,
      description,
      price,
      compareAt,
      images,
      category,
      brand,
      tags,
      active,
      featured,
      preorder,
      sizes,
      colors,
      variants,
    } = req.body;

    if (!storeId) {
      return res.status(400).json({ error: 'Boutique manquante — choisis une boutique' });
    }
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Le nom du produit est requis' });
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return res.status(400).json({ error: 'Le prix doit être supérieur à 0' });
    }

    const trimmedName = name.trim();
    let finalSlug = typeof slug === 'string' && slug.trim() ? slug.trim() : '';
    if (!finalSlug) {
      finalSlug = trimmedName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const product = await prisma.product.create({
      data: {
        storeId,
        name: trimmedName,
        slug: finalSlug,
        description,
        price: priceNum,
        compareAt,
        category,
        brand: brand || '',
        tags: Array.isArray(tags) ? tags.join(',') : (tags || ''),
        active: active ?? true,
        featured: featured || false,
        preorder: storeId === 'omen-shoes' && !!preorder,
        sizes: storeId === 'omen-shoes' && Array.isArray(sizes) ? sizes.map((s: any) => String(s).trim()).filter(Boolean).join(',') : '',
        colors: colors?.length ? {
          create: colors.map((c: any, idx: number) => ({
            name: c.name,
            hex: c.hex,
            sortOrder: c.sortOrder ?? idx,
            images: c.images?.length ? {
              create: c.images.map((img: any, i: number) => ({
                url: img.url || img,
                alt: img.alt,
                sortOrder: img.sortOrder ?? i,
                isMain: img.isMain ?? (i === 0),
              })),
            } : undefined,
            variants: c.variants?.length ? {
              create: c.variants.map((v: any) => ({
                size: v.size,
                sku: v.sku,
                price: v.price,
                compareAt: v.compareAt,
                stock: v.stock ?? 0,
                active: v.active ?? true,
              })),
            } : undefined,
          })),
        } : undefined,
        images: images?.length ? {
          create: images.map((img: any, i: number) => ({
            url: img.url || img,
            alt: img.alt,
            sortOrder: img.sortOrder ?? i,
            isMain: img.isMain ?? (i === 0),
          })),
        } : undefined,
        variants: variants?.length ? {
          create: variants.map((v: any) => ({
            colorId: v.colorId,
            size: v.size,
            sku: v.sku,
            price: v.price,
            compareAt: v.compareAt,
            stock: v.stock ?? 0,
            active: v.active ?? true,
          })),
        } : undefined,
      },
      include: {
        colors: { include: { images: true } },
        images: true,
        variants: true,
      },
    });

    return res.status(201).json(product);
  } catch (error: any) {
    console.error('[products:create]', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({
        error: 'Un produit existe déjà avec ce nom ou ce lien — choisis un autre nom',
      });
    }
    if (error?.code === 'P2003') {
      return res.status(400).json({ error: 'Boutique ou catégorie inconnue' });
    }
    return res.status(500).json({ error: 'Échec de la création du produit' });
  }
});

// PUT /api/products/:id — Modifier un produit (Dashboard)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const {
      storeId,
      name,
      slug,
      description,
      price,
      compareAt,
      category,
      brand,
      tags,
      active,
      featured,
      preorder,
      sizes,
      colors,
      images,
      variants,
    } = req.body;

    // Update product base fields
    await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        slug,
        description,
        price,
        compareAt,
        category,
        brand: brand ?? undefined,
        tags: Array.isArray(tags) ? tags.join(',') : (tags || ''),
        active,
        featured,
        ...(typeof preorder === 'boolean' && storeId === 'omen-shoes' ? { preorder } : {}),
        ...(storeId === 'omen-shoes' && Array.isArray(sizes)
          ? { sizes: sizes.map((s: any) => String(s).trim()).filter(Boolean).join(',') }
          : {}),
      },
    });

    // Handle colors - upsert each
    if (colors) {
      for (const c of colors) {
        if (c.id?.startsWith('cuid_') || !c.id) {
          // New color
          await prisma.productColor.create({
            data: {
              productId: req.params.id,
              name: c.name,
              hex: c.hex,
              sortOrder: c.sortOrder ?? 0,
              images: c.images?.length ? {
                create: c.images.map((img: any, i: number) => ({
                  url: img.url || img,
                  alt: img.alt,
                  sortOrder: img.sortOrder ?? i,
                  isMain: img.isMain ?? (i === 0),
                })),
              } : undefined,
              variants: c.variants?.length ? {
                create: c.variants.map((v: any) => ({
                  size: v.size,
                  sku: v.sku,
                  price: v.price,
                  compareAt: v.compareAt,
                  stock: v.stock ?? 0,
                  active: v.active ?? true,
                })),
              } : undefined,
            },
          });
        } else {
          // Existing color - update
          await prisma.productColor.update({
            where: { id: c.id },
            data: {
              name: c.name,
              hex: c.hex,
              sortOrder: c.sortOrder ?? 0,
            },
          });
          // Handle color images
          if (c.images) {
            for (const img of c.images) {
              if (img.id?.startsWith('cuid_') || !img.id) {
                await prisma.productImage.create({
                  data: {
                    productId: req.params.id,
                    colorId: c.id,
                    url: img.url || img,
                    alt: img.alt,
                    sortOrder: img.sortOrder ?? 0,
                    isMain: img.isMain ?? false,
                  },
                });
              } else {
                await prisma.productImage.update({
                  where: { id: img.id },
                  data: {
                    url: img.url || img,
                    alt: img.alt,
                    sortOrder: img.sortOrder ?? 0,
                    isMain: img.isMain ?? false,
                  },
                });
              }
            }
          }
          // Handle color variants
          if (c.variants) {
            for (const v of c.variants) {
              if (v.id?.startsWith('cuid_') || !v.id) {
                await prisma.productVariant.create({
                  data: {
                    productId: req.params.id,
                    colorId: c.id,
                    size: v.size,
                    sku: v.sku,
                    price: v.price,
                    compareAt: v.compareAt,
                    stock: v.stock ?? 0,
                    active: v.active ?? true,
                  },
                });
              } else {
                await prisma.productVariant.update({
                  where: { id: v.id },
                  data: {
                    size: v.size,
                    sku: v.sku,
                    price: v.price,
                    compareAt: v.compareAt,
                    stock: v.stock ?? 0,
                    active: v.active ?? true,
                  },
                });
              }
            }
          }
        }
      }
    }

    // Handle general images (not color-specific)
    if (images) {
      for (const img of images) {
        if (img.id?.startsWith('cuid_') || !img.id) {
          await prisma.productImage.create({
            data: {
              productId: req.params.id,
              url: img.url || img,
              alt: img.alt,
              sortOrder: img.sortOrder ?? 0,
              isMain: img.isMain ?? false,
            },
          });
        } else {
          await prisma.productImage.update({
            where: { id: img.id },
            data: {
              url: img.url || img,
              alt: img.alt,
              sortOrder: img.sortOrder ?? 0,
              isMain: img.isMain ?? false,
            },
          });
        }
      }
    }

    // Handle global variants (not color-specific)
    if (variants) {
      for (const v of variants) {
        if (v.id?.startsWith('cuid_') || !v.id) {
          await prisma.productVariant.create({
            data: {
              productId: req.params.id,
              colorId: v.colorId,
              size: v.size,
              sku: v.sku,
              price: v.price,
              compareAt: v.compareAt,
              stock: v.stock ?? 0,
              active: v.active ?? true,
            },
          });
        } else {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              size: v.size,
              sku: v.sku,
              price: v.price,
              compareAt: v.compareAt,
              stock: v.stock ?? 0,
              active: v.active ?? true,
            },
          });
        }
      }
    }

    // Return updated product with relations
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        colors: { include: { images: true }, orderBy: { sortOrder: 'asc' } },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: [{ colorId: 'asc' }, { size: 'asc' }] },
      },
    });

    return res.json(product);
  } catch (error: any) {
    console.error('[products:update]', error);
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Un produit existe déjà avec ce nom ou ce lien — choisis un autre nom' });
    }
    return res.status(500).json({ error: 'Échec de la mise à jour du produit' });
  }
});

// DELETE /api/products/:id — Supprimer un produit (Dashboard)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

// DELETE /api/products/color/:colorId — Supprimer une couleur
router.delete('/color/:colorId', async (req: Request, res: Response) => {
  try {
    await prisma.productColor.delete({ where: { id: req.params.colorId } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete color' });
  }
});

// DELETE /api/products/image/:imageId — Supprimer une image
router.delete('/image/:imageId', async (req: Request, res: Response) => {
  try {
    await prisma.productImage.delete({ where: { id: req.params.imageId } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete image' });
  }
});

// DELETE /api/products/variant/:variantId — Supprimer un variant
router.delete('/variant/:variantId', async (req: Request, res: Response) => {
  try {
    await prisma.productVariant.delete({ where: { id: req.params.variantId } });
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete variant' });
  }
});

// POST /api/products/upload — Upload images
router.post('/upload', async (req: Request, res: Response) => {
  try {
    // This is handled by multer middleware in server.ts
    // Return the uploaded file URLs
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to upload' });
  }
});

export default router;