import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

import adminRouter from './routes/admin.routes';
import paymentsRouter from './routes/payments.routes';
import ordersRouter from './routes/orders.routes';
import productsRouter from './routes/products.routes';
import webhooksRouter from './routes/webhooks.routes';
import dashboardRouter from './routes/dashboard.routes';

try { dotenv.config(); } catch {}

// Cloudinary config
const useCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME;
if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });
}

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================================
// UPLOAD CONFIG
// ============================================================
const isVercel = !!process.env.VERCEL;

let upload: multer.Multer;

if (useCloudinary) {
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  });
} else {
  const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');
  try { if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true }); } catch {}
  const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  });
  upload = multer({ storage: diskStorage, limits: { fileSize: 10 * 1024 * 1024 } });
}

// ============================================================
// MIDDLEWARE
// ============================================================

app.use('/api/webhooks', express.raw({ type: 'application/json' }));

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());

// ============================================================
// UPLOAD ROUTES
// ============================================================
app.post('/api/upload', upload.array('files', 20), async (req: any, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) return res.status(400).json({ error: 'Aucun fichier' });

    if (useCloudinary) {
      const urls: string[] = [];
      for (const file of files) {
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'omen/products',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        urls.push(result.secure_url);
      }
      return res.json({ urls });
    }

    // Local storage fallback
    const host = req.headers.host || `localhost:${PORT}`;
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const urls = files.map(f => `${protocol}://${host}/uploads/${f.filename}`);
    res.json({ urls });
  } catch (err: any) {
    console.error('Upload error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
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
  res.json({ status: 'ok', cloudinary: useCloudinary, timestamp: new Date().toISOString() });
});

// ============================================================
// START (local only — Vercel uses api/index.ts)
// ============================================================

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[API] Server running on port ${PORT} | Cloudinary: ${useCloudinary}`);
  });
}

export default app;
