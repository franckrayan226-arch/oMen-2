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

try { dotenv.config(); } catch {}

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================================
// UPLOAD CONFIG (multer)
// ============================================================
const isVercel = !!process.env.VERCEL;
const UPLOAD_DIR = isVercel ? '/tmp' : path.resolve(process.cwd(), 'public', 'uploads');
if (!isVercel) {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch {}
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (isVercel && !fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    } catch {}
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format non supporté.'));
  },
});

// ============================================================
// MIDDLEWARE
// ============================================================

app.use('/api/webhooks', express.raw({ type: 'application/json' }));

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL_SHOES,
      process.env.FRONTEND_URL_WELLNESS,
      process.env.FRONTEND_URL_DASHBOARD,
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3000',
    ].filter(Boolean);

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());

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

app.post('/api/upload', express.json(), async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL requise' });
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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================
// START (local only — Vercel uses api/index.ts)
// ============================================================

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[API] Server running on port ${PORT}`);
  });
}

export default app;