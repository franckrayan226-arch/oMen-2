import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import adminRouter from './routes/admin.routes';
import paymentsRouter from './routes/payments.routes';
import ordersRouter from './routes/orders.routes';
import productsRouter from './routes/products.routes';
import webhooksRouter from './routes/webhooks.routes';
import dashboardRouter from './routes/dashboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================================
// UPLOAD CONFIG (multer)
// ============================================================
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.'));
  },
});

// ============================================================
// MIDDLEWARE
// ============================================================

// Webhooks ont besoin du raw body pour la vérification de signature
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL_SHOES || 'http://localhost:3001',
    process.env.FRONTEND_URL_WELLNESS || 'http://localhost:3002',
    process.env.FRONTEND_URL_DASHBOARD || 'http://localhost:3003',
  ],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOAD_DIR));

// ============================================================
// UPLOAD ROUTES
// ============================================================
app.post('/api/upload', upload.array('files', 20), (req: any, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) return res.status(400).json({ error: 'Aucun fichier' });

  const host = req.headers.host || `localhost:${PORT}`;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const urls = files.map(f => `${protocol}://${host}/uploads/${f.filename}`);
  res.json({ urls });
});

// URL import endpoint
app.post('/api/upload', express.json(), async (req, res) => {
  const { url, site } = req.body;
  if (!url) return res.status(400).json({ error: 'URL requise' });

  // For URL import, we just return the URL as-is (the frontend will handle downloading if needed)
  // In production, you might want to download and re-host
  res.json({ urls: [url] });
});

// ============================================================
// ROUTES
// ============================================================

app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================
// START
// ============================================================

app.listen(PORT, () => {
  console.log(`[API] Server running on port ${PORT}`);
  console.log(`[API] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;