// Omen — Backend zéro dépendance. Produits des 2 sites, uploads, commandes, contenu, auth admin.
// Démarrage : node server/server.mjs  (port 4000 par défaut)
import http from "http";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APPS = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 4000);

const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIRS = {
  shoes: path.join(APPS, "omen-shoes-vite", "public", "shoes"),
  wellness: path.join(APPS, "omen-wellness", "public", "img", "products"),
};

const DB_FILE = path.join(DATA_DIR, "db.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];

function load(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
function save(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}
const uid = () => crypto.randomBytes(9).toString("hex");
const hashPassword = (pw) =>
  crypto.createHash("sha256").update(`omen::${pw}`).digest("hex");

// ── DB par défaut : le catalogue actuel des 2 sites ─────────────────────────
function defaultDb() {
  const shoe = (i, slug, name, brand, price, compareAt, colors, badge, image, description, sizes, coloris) => ({
    id: String(i),
    site: "shoes",
    slug,
    name,
    brand,
    price,
    compareAt: compareAt ?? null,
    badge: badge ?? null,
    description,
    active: true,
    images: { [colors[0].name]: [image] },
    colors,
    sizes: sizes.map((eu) => ({ eu, stock: true })),
    coloris,
  });
  const w = (i, slug, name, brand, category, price, compareAt, badge, image, description, ritual, actives, variants) => ({
    id: String(i),
    site: "wellness",
    slug,
    name,
    brand,
    category,
    price,
    compareAt: compareAt ?? null,
    badge: badge ?? null,
    description,
    active: true,
    images: { Defaut: [image] },
    colors: [{ name: "Defaut", hex: "#dfeacf" }],
    variants,
    ritual,
    actives,
  });

  const p1 = shoe(1, "nike-air-max-90", "Nike Air Max 90", "Nike", 45000, 55000,
    [{ name: "Noir/Blanc", hex: "#111111" }, { name: "Blanc/Gris", hex: "#e5e5e5" }, { name: "Triple Noir", hex: "#1a1a1a" }],
    "Nouveau", "/shoes/nike-air-max-90.jpg",
    "L'Air Max 90 revisité avec une bulle Air emblématique pour un confort tout-day.",
    SHOE_SIZES, 3);
  const p2 = shoe(2, "jordan-1-retro-high", "Jordan 1 Retro High OG", "Jordan", 75000, null,
    [{ name: "Bred", hex: "#111111" }, { name: "Chicago", hex: "#c41e3a" }],
    "Top", "/shoes/jordan-1.jpg",
    "L'original qui a tout lancé. Cuir premium et silhouette iconique.",
    SHOE_SIZES, 2);
  const p3 = shoe(3, "new-balance-550", "New Balance 550", "New Balance", 38000, null,
    [{ name: "Blanc", hex: "#f5f5f5" }, { name: "Gris", hex: "#999999" }],
    null, "/shoes/new-balance-550.jpg",
    "Le classique revisité. Confort et style rétro.",
    SHOE_SIZES, 4);
  const p4 = shoe(4, "adidas-samba-og", "adidas Samba OG", "adidas", 42000, null,
    [{ name: "Noir", hex: "#111111" }, { name: "Blanc", hex: "#f5f5f5" }],
    "Nouveau", "/shoes/adidas-samba-og.jpg",
    "Le Samba, iconique depuis les terrains de foot.",
    SHOE_SIZES, 2);
  const p5 = shoe(5, "nike-dunk-low", "Nike Dunk Low Retro", "Nike", 48000, null,
    [{ name: "Panda", hex: "#111111" }, { name: "University", hex: "#c41e3a" }],
    null, "/shoes/nike-dunk-low.jpg",
    "Le Dunk, né sur les courts, devenu icône de la rue.",
    SHOE_SIZES, 5);
  const p6 = shoe(6, "jordan-4-retro", "Jordan 4 Retro", "Jordan", 85000, 95000,
    [{ name: "Bred", hex: "#111111" }, { name: "White Cement", hex: "#e5e5e5" }],
    "Promo", "/shoes/jordan-4-retro.jpg",
    "La Jordan 4, aérodynamique et audacieuse.",
    SHOE_SIZES, 2);
  const p7 = shoe(7, "puma-suede-classic", "Puma Suede Classic", "Puma", 32000, null,
    [{ name: "Noir", hex: "#111111" }, { name: "Bleu", hex: "#1e40af" }],
    null, "/shoes/puma-suede-classic.jpg",
    "Le Suede, icône du streetwear depuis 1968.",
    SHOE_SIZES, 3);
  const p8 = shoe(8, "lv-trainer", "Louis Vuitton LV Trainer", "Louis Vuitton", 120000, null,
    [{ name: "Blanc", hex: "#f5f5f5" }, { name: "Noir", hex: "#111111" }],
    "Top", "/shoes/lv-trainer.jpg",
    "Le LV Trainer, luxe et streetwear réunis. Calf leather et Monogram.",
    SHOE_SIZES, 2);
  const p9 = shoe(9, "nike-air-force-1", "Nike Air Force 1 '07", "Nike", 40000, null,
    [{ name: "Blanc", hex: "#f5f5f5" }, { name: "Noir", hex: "#111111" }],
    null, "/shoes/nike-air-force-1-og.jpg",
    "L'Air Force 1, pionnier de la sneaker culture.",
    SHOE_SIZES, 4);
  const p10 = shoe(10, "adidas-stan-smith", "adidas Stan Smith", "adidas", 35000, null,
    [{ name: "Blanc", hex: "#f5f5f5" }, { name: "Noir", hex: "#111111" }],
    null, "/shoes/adidas-stan.jpg",
    "Le Stan Smith, élégance tennis depuis 1971.",
    SHOE_SIZES, 3);
  const p11 = shoe(11, "new-balance-2002r", "New Balance 2002R", "New Balance", 52000, null,
    [{ name: "Gris", hex: "#888888" }, { name: "Noir", hex: "#111111" }],
    "Nouveau", "/shoes/nb-2002r.jpg",
    "Le 2002R, confort running et style moderne.",
    SHOE_SIZES, 2);
  const p12 = shoe(12, "vans-old-skool", "Vans Old Skool", "Vans", 25000, null,
    [{ name: "Noir", hex: "#111111" }, { name: "Blanc", hex: "#f5f5f5" }],
    null, "/shoes/vans.jpg",
    "L'Old Skool, la skate shoe par excellence.",
    SHOE_SIZES, 3);
  // Tailles indisponibles de démo pour la fiche produit
  p2.sizes = p2.sizes.map((s) => (s.eu === "45" ? { ...s, stock: false } : s));
  p6.sizes = p6.sizes.map((s) => (["44", "45"].includes(s.eu) ? { ...s, stock: false } : s));

  return {
    products: [
      p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12,
      w(13, "minoxidil-5", "Minoxidil 5%", "Omen Lab", "Anti-chute", 15000, null, "Best-seller", "/img/products/minoxidil-5.jpg",
        "La référence clinique contre la chute de cheveux. Formule sans propylène glycol, spectre élargi cheveux et barbe, séchage rapide sans film gras.",
        ["Appliquer 1 ml matin et soir sur cuir chevelu sec.", "Masser 30 secondes du bout des doigts.", "Laisser agir — ne pas rincer.", "Résultats visibles entre la 8e et la 16e semaine d'usage régulier."],
        "Minoxidil 50 mg/ml · Panthénol · Eau purifiée",
        [{ label: "Flacon 60 ml", price: 15000 }, { label: "Duo 2 × 60 ml", price: 27000, compareAt: 30000 }]),
      w(14, "serum-croissance-barbe", "Sérum Croissance Barbe", "Omen Lab", "Barbe", 12000, null, "Nouveau", "/img/products/serum-barbe.jpg",
        "Un sérum ciblé pour densifier la barbe et combler les zones clairsemées. Texture légère à absorption immédiate, sans brillance grasse.",
        ["3 à 4 gouttes sur barbe propre et sèche.", "Répartir des racines aux pointes, jusqu'à la peau.", "Utiliser chaque soir pendant 8 semaines minimum."],
        "Biotine · Caféine · Huile de nigelle · Vitamine E",
        [{ label: "Flacon 30 ml", price: 12000 }, { label: "Flacon 50 ml", price: 18000 }]),
      w(15, "shampooing-densifiant", "Shampooing Densifiant", "Omen Lab", "Soin", 9000, null, null, "/img/products/shampooing.jpg",
        "Base lavante douce sans sulfates agressifs qui nettoie sans décaper et prépare le cuir chevelu aux traitements anti-chute.",
        ["Masser sur cheveux mouillés 1 à 2 minutes.", "Rincer abondamment.", "Utiliser 3 à 4 fois par semaine."],
        "Caféine · Kératine hydrolysée · Romarin",
        [{ label: "Flacon 250 ml", price: 9000 }]),
      w(16, "serum-cuir-chevelu", "Sérum Cuir Chevelu", "Omen Lab", "Soin", 11000, null, null, "/img/products/serum-cuir.jpg",
        "Un soin apaisant quotidien pour les cuirs chevelus sensibles : réduit les démangeaisons, régule les brillances et ancre la fibre.",
        ["Répartir 4 à 6 gouttes raie par raie.", "Masser le soir, sur cuir chevelu sec ou légèrement humide.", "Usage quotidien sans rinçage."],
        "Niacinamide · Zinc PCA · Aloe vera",
        [{ label: "Flacon 30 ml", price: 11000 }]),
      w(17, "routine-duo-anti-chute", "Duo Anti-Chute", "Omen Lab", "Rituels", 22000, 24000, "Promo", "/img/products/duo.jpg",
        "Le duo essentiel : Minoxidil 5% et Sérum Cuir Chevelu, pensés pour agir ensemble. Le traitement, puis l'ancrage.",
        ["Minoxidil matin, sérum apaisant au soir.", "Espacer les deux applications d'au moins 6 heures.", "Recommandé en cure de 3 mois."],
        "Minoxidil 5% · Niacinamide · Zinc PCA",
        [{ label: "Coffret 2 flacons", price: 22000, compareAt: 24000 }]),
      w(18, "huile-rituel-nuit", "Huile Rituel Nuit", "Omen Lab", "Rituels", 10000, null, null, "/img/products/huile-nuit.jpg",
        "Un mélange d'huiles pressées à froid à déposer avant le sommeil. Nourrit la fibre, scelle l'hydratation, parfume discrètement.",
        ["Chauffer 5 gouttes entre les paumes.", "Appliquer sur pointes et longueurs.", "Laisser poser toute la nuit, 2 à 3 fois par semaine."],
        "Huile de ricin · Jojoba · Argan · Ylang-ylang",
        [{ label: "Flacon 50 ml", price: 10000 }]),
      w(19, "dermaroller-titanium", "Dermaroller Titane 0,5 mm", "Omen Lab", "Accessoires", 8000, null, null, "/img/products/dermaroller.jpg",
        "Micro-aiguilles titane pour potentialiser l'absorption des sérums. À associer au minoxidil pour une routine complète.",
        ["Désinfecter avant chaque usage.", "Rouler 8 à 10 passes par zone, pression légère.", "Espacer les séances de 5 à 7 jours."],
        "540 aiguilles titane 0,5 mm",
        [{ label: "0,5 mm", price: 8000 }]),
      w(20, "brosse-massante", "Brosse Massante Silicone", "Omen Lab", "Accessoires", 5000, null, null, "/img/products/brosse.jpg",
        "Brosse souple qui active la microcirculation au shampooing et déloge les résidus sans agresser le cuir chevelu.",
        ["Utiliser sous la douche sur cheveux mouillés.", "Masser en mouvements circulaires.", "Rincer et sécher après chaque usage."],
        "Silicone médical · Manche ergonomique",
        [{ label: "Taille unique", price: 5000 }]),
    ],
    site: {
      shoes: {
        hero: [
          { title: "Marche\navec style.", subtitle: "SNEAKERS · LOMÉ & OUAGA", cta: "Voir les paires", to: "/catalogue", image: "/shoes/widget-1.jpg" },
          { title: "Style\nauthentique.", subtitle: "NIKE · COLLECTION", cta: "Découvrir", to: "/catalogue?marque=Nike", image: "/shoes/widget-2.jpg" },
          { title: "La légende\nurbaine.", subtitle: "JORDAN · RÉTRO", cta: "Voir les paires", to: "/catalogue?marque=Jordan", image: "/shoes/widget-3.jpg" },
          { title: "Élégance\nquotidienne.", subtitle: "ADIDAS · ORIGINALS", cta: "Explorer", to: "/catalogue?marque=adidas", image: "/shoes/widget-4.jpg" },
          { title: "Confort\nabsolu.", subtitle: "NEW BALANCE · 550", cta: "Découvrir", to: "/catalogue?marque=New+Balance", image: "/shoes/widget-5.jpg" },
          { title: "Tendance\nafricaine.", subtitle: "PUMA · CLASSIC", cta: "Voir les paires", to: "/catalogue?marque=Puma", image: "/shoes/widget-6.jpg" },
        ],
        marquee: ["Nike", "Jordan", "adidas", "New Balance", "Puma", "Louis Vuitton", "Vans", "Salomon", "Reebok"],
      },
      wellness: {},
    },
    orders: [],
    admin: { user: "admin", passHash: hashPassword("omen2026") },
  };
}

let db = load(DB_FILE, null);
if (!db || !Array.isArray(db.products)) {
  db = defaultDb();
  save(DB_FILE, db);
  console.log(`[omen-api] base de données initialisée → ${DB_FILE}`);
}

let sessions = load(SESSIONS_FILE, {});

// ── Helpers HTTP ─────────────────────────────────────────────────────────────
const MIME = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".avif": "image/avif", ".ico": "image/x-icon",
};

function json(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(body);
}

function readBody(req, limit = 25 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(Object.assign(new Error("Payload trop volumineux (max 25 Mo)"), { code: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseMultipart(buf, boundary) {
  const parts = {};
  const files = [];
  const delim = Buffer.from(`--${boundary}`);
  let start = buf.indexOf(delim);
  while (start !== -1) {
    const next = buf.indexOf(delim, start + delim.length);
    if (next === -1) break;
    const chunk = buf.slice(start + delim.length + 2, next - 2); // \r\n … \r\n
    const headerEnd = chunk.indexOf("\r\n\r\n");
    if (headerEnd !== -1) {
      const header = chunk.slice(0, headerEnd).toString("utf8");
      const body = chunk.slice(headerEnd + 4);
      const nameMatch = /name="([^"]*)"/.exec(header);
      const fileMatch = /filename="([^"]*)"/.exec(header);
      const typeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(header);
      const field = { name: nameMatch ? nameMatch[1] : "", data: body };
      if (fileMatch && fileMatch[1]) {
        files.push({ field: field.name, filename: fileMatch[1], type: typeMatch ? typeMatch[1].trim() : "application/octet-stream", data: body });
      } else {
        parts[field.name] = body.toString("utf8");
      }
    }
    start = next;
  }
  return { parts, files };
}

function saveUpload(file, site) {
  const dir = UPLOAD_DIRS[site] || UPLOAD_DIRS.shoes;
  fs.mkdirSync(dir, { recursive: true });
  const ext = (path.extname(file.filename) || ".jpg").toLowerCase();
  const base = path.basename(file.filename, path.extname(file.filename))
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "image";
  const name = `${base}-${uid()}${ext}`;
  fs.writeFileSync(path.join(dir, name), file.data);
  const urlPath = site === "wellness" ? `/img/products/${name}` : `/shoes/${name}`;
  return { url: urlPath, size: file.data.length };
}

function getSessionUser(req) {
  const auth = req.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const sess = sessions[token];
  if (!sess || Date.now() - sess.at > 1000 * 60 * 60 * 24 * 14) return null;
  return sess.user;
}

function requireAdmin(req, res) {
  const user = getSessionUser(req);
  if (!user) {
    json(res, 401, { error: "Non authentifié — connecte-toi au dashboard." });
    return null;
  }
  return user;
}

function checkOrigin(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}

function cleanProduct(input, existing) {
  const p = existing ? { ...existing } : {
    id: uid(),
    site: "shoes",
    active: true,
  };
  if (input.site === "shoes" || input.site === "wellness") p.site = input.site;
  const str = (v) => (typeof v === "string" ? v.trim() : undefined);
  for (const k of ["slug", "name", "brand", "category", "description", "actives"]) {
    const v = str(input[k]);
    if (v !== undefined) p[k] = v;
  }
  if (typeof input.price === "number" && input.price >= 0) p.price = Math.round(input.price);
  if (input.compareAt === null || typeof input.compareAt === "number") p.compareAt = input.compareAt == null ? null : Math.round(input.compareAt);
  if (typeof input.badge === "string" || input.badge === null) p.badge = input.badge || null;
  if (typeof input.active === "boolean") p.active = input.active;
  if (Array.isArray(input.colors)) {
    p.colors = input.colors
      .filter((c) => c && typeof c.name === "string" && c.name.trim())
      .map((c) => ({
        name: c.name.trim(),
        hex: typeof c.hex === "string" && /^#[0-9a-f]{3,8}$/i.test(c.hex) ? c.hex : "#cccccc",
        ...(c.available === false ? { available: false } : {}),
      }));
  }
  if (input.images && typeof input.images === "object" && !Array.isArray(input.images)) {
    const imgs = {};
    for (const [colorName, arr] of Object.entries(input.images)) {
      if (Array.isArray(arr)) {
        const urls = arr.filter((u) => typeof u === "string" && u.trim()).map((u) => u.trim());
        if (urls.length) imgs[colorName] = urls;
      }
    }
    if (Object.keys(imgs).length) p.images = imgs;
  }
  if (Array.isArray(input.sizes)) {
    p.sizes = input.sizes
      .filter((s) => s && s.eu !== undefined && s.eu !== null && String(s.eu).trim() !== "")
      .map((s) => ({ eu: String(s.eu).trim(), stock: s.stock !== false }));
  }
  if (Array.isArray(input.variants)) {
    p.variants = input.variants
      .filter((v) => v && typeof v.label === "string" && v.label.trim())
      .map((v) => ({
        label: v.label.trim(),
        price: typeof v.price === "number" ? Math.round(v.price) : p.price,
        compareAt: typeof v.compareAt === "number" ? Math.round(v.compareAt) : undefined,
      }));
  }
  if (Array.isArray(input.ritual)) p.ritual = input.ritual.filter((r) => typeof r === "string" && r.trim()).map((r) => r.trim());
  // slug auto depuis le nom si absent
  if (!p.slug && p.name) {
    p.slug = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || uid();
  }
  // collision de slug (hors édition du même produit)
  if (db.products.some((x) => x.slug === p.slug && x.id !== p.id)) p.slug = `${p.slug}-${p.id.slice(0, 4)}`;
  // une couleur par défaut si vide
  if (!p.colors?.length) p.colors = [{ name: "Defaut", hex: "#cccccc" }];
  if (!p.images || !Object.keys(p.images).length) p.images = { [p.colors[0].name]: [] };
  // images dont la couleur n'existe plus → rattachées à la première couleur
  for (const key of Object.keys(p.images)) {
    if (!p.colors.some((c) => c.name === key)) {
      p.colors[0].name = p.colors[0].name;
      p.images[p.colors[0].name] = [...(p.images[p.colors[0].name] || []), ...p.images[key]];
      delete p.images[key];
    }
  }
  return p;
}

function firstImage(p) {
  for (const c of p.colors || []) {
    const arr = p.images?.[c.name];
    if (arr && arr.length) return arr[0];
  }
  for (const arr of Object.values(p.images || {})) if (arr && arr.length) return arr[0];
  return "";
}

function cardView(p) {
  return {
    id: p.id, site: p.site, slug: p.slug, name: p.name, brand: p.brand,
    category: p.category, price: p.price, compareAt: p.compareAt, badge: p.badge,
    active: p.active !== false,
    image: firstImage(p),
    colorsCount: (p.colors || []).length,
    coloris: p.coloris,
  };
}

function detailView(p) {
  return {
    ...cardView(p),
    description: p.description,
    colors: p.colors,
    images: p.images,
    sizes: p.sizes,
    variants: p.variants,
    ritual: p.ritual,
    actives: p.actives,
  };
}

// ── Serveur ──────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  try {
    if (checkOrigin(req, res)) return;
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathName = decodeURIComponent(url.pathname);
    const method = req.method;

    // ── Auth ──
    if (method === "POST" && pathName === "/api/admin/login") {
      const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
      if (body.user === db.admin.user && hashPassword(String(body.pass || "")) === db.admin.passHash) {
        const token = uid() + uid();
        sessions[token] = { user: db.admin.user, at: Date.now() };
        save(SESSIONS_FILE, sessions);
        return json(res, 200, { token, user: db.admin.user });
      }
      return json(res, 401, { error: "Identifiants incorrects." });
    }
    if (method === "POST" && pathName === "/api/admin/logout") {
      const auth = req.headers["authorization"] || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
      if (token) { delete sessions[token]; save(SESSIONS_FILE, sessions); }
      return json(res, 200, { ok: true });
    }

    // ── Storefronts : lecture publique ──
    if (method === "GET" && pathName === "/api/products") {
      const site = url.searchParams.get("site");
      let items = db.products.filter((p) => p.active !== false && (!site || p.site === site));
      if (url.searchParams.get("includeInactive") === "1") items = db.products.filter((p) => !site || p.site === site);
      return json(res, 200, { products: items.map(cardView) });
    }
    if (method === "GET" && pathName.startsWith("/api/products/")) {
      const slug = pathName.slice("/api/products/".length);
      const p = db.products.find((x) => x.slug === slug);
      if (!p) return json(res, 404, { error: "Produit introuvable" });
      return json(res, 200, { product: detailView(p) });
    }
    if (method === "GET" && pathName === "/api/site") {
      const site = url.searchParams.get("site") || "shoes";
      return json(res, 200, db.site[site] || {});
    }
    if (method === "GET" && pathName === "/api/health") {
      return json(res, 200, { ok: true, products: db.products.length, orders: db.orders.length });
    }

    // ── Dashboard : écritures (admin) ──
    if (method === "POST" && pathName === "/api/products") {
      if (!requireAdmin(req, res)) return;
      const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
      const p = cleanProduct(body, null);
      db.products.unshift(p);
      save(DB_FILE, db);
      return json(res, 201, { product: detailView(p) });
    }
    {
      const m = /^\/api\/products\/([a-z0-9-]+)$/.exec(pathName);
      if (m && (method === "PUT" || method === "PATCH")) {
        if (!requireAdmin(req, res)) return;
        const p = db.products.find((x) => x.id === m[1]);
        if (!p) return json(res, 404, { error: "Produit introuvable" });
        const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
        const updated = cleanProduct(body, p);
        db.products = db.products.map((x) => (x.id === p.id ? updated : x));
        save(DB_FILE, db);
        return json(res, 200, { product: detailView(updated) });
      }
      if (m && method === "DELETE") {
        if (!requireAdmin(req, res)) return;
        const before = db.products.length;
        db.products = db.products.filter((x) => x.id !== m[1]);
        if (db.products.length === before) return json(res, 404, { error: "Produit introuvable" });
        save(DB_FILE, db);
        return json(res, 200, { ok: true });
      }
    }

    // ── Upload d'images (fichier local ou URL) ──
    if (method === "POST" && pathName === "/api/upload") {
      if (!requireAdmin(req, res)) return;
      const ctype = req.headers["content-type"] || "";
      const site = url.searchParams.get("site") === "wellness" ? "wellness" : "shoes";
      if (ctype.includes("multipart/form-data")) {
        const boundary = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(ctype);
        if (!boundary) return json(res, 400, { error: "Boundary multipart manquant." });
        const { files } = parseMultipart(await readBody(req), (boundary[1] || boundary[2]).trim());
        if (!files.length) return json(res, 400, { error: "Aucun fichier reçu." });
        const saved = files.map((f) => saveUpload(f, site));
        return json(res, 201, { uploads: saved });
      }
      // JSON : { url: "https://…" } → téléchargement depuis un lien web
      if (ctype.includes("application/json")) {
        const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
        const link = String(body.url || "").trim();
        if (!/^https?:\/\//i.test(link)) return json(res, 400, { error: "URL invalide (http/https requis)." });
        const resp = await fetch(link);
        if (!resp.ok) return json(res, 400, { error: `Téléchargement impossible (HTTP ${resp.status}).` });
        const buf = Buffer.from(await resp.arrayBuffer());
        if (!buf.length) return json(res, 400, { error: "Fichier distant vide." });
        const ctypeRemote = resp.headers.get("content-type") || "image/jpeg";
        const extFromType = (ctypeRemote.split("/")[1] || "jpg").split(";")[0].replace("jpeg", "jpg");
        const saved = saveUpload({ filename: `lien.${extFromType}`, data: buf }, site);
        return json(res, 201, { uploads: [saved] });
      }
      return json(res, 400, { error: "Content-Type non supporté." });
    }

    // ── Commandes ──
    if (method === "POST" && pathName === "/api/orders") {
      const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
      const order = {
        id: uid(),
        createdAt: new Date().toISOString(),
        status: "nouvelle",
        customer: {
          name: String(body.customer?.name || "").trim(),
          phone: String(body.customer?.phone || "").trim(),
          email: body.customer?.email ? String(body.customer.email).trim() : null,
          city: String(body.customer?.city || "").trim(),
          address: String(body.customer?.address || "").trim(),
          country: String(body.customer?.country || "").trim() || null,
        },
        payment: String(body.payment || ""),
        accountEmail: body.accountEmail || null,
        items: (Array.isArray(body.items) ? body.items : []).map((it) => ({
          site: it.site || null,
          productId: String(it.productId || ""),
          slug: it.slug || "",
          name: String(it.name || ""),
          brand: it.brand || null,
          price: Math.round(Number(it.price) || 0),
          qty: Math.max(1, Math.round(Number(it.qty) || 1)),
          size: it.size || null,
          variant: it.variant || null,
          color: it.color || null,
          image: it.image || null,
        })),
        total: Math.round(Number(body.total) || 0),
      };
      if (!order.items.length) return json(res, 400, { error: "Commande vide." });
      if (!order.customer.name || !order.customer.phone) return json(res, 400, { error: "Nom et téléphone requis." });
      db.orders.unshift(order);
      if (db.orders.length > 500) db.orders.length = 500;
      save(DB_FILE, db);
      return json(res, 201, { order: { id: order.id } });
    }
    if (method === "GET" && pathName === "/api/orders") {
      if (!requireAdmin(req, res)) return;
      return json(res, 200, { orders: db.orders });
    }
    {
      const m = /^\/api\/orders\/([a-z0-9-]+)$/.exec(pathName);
      if (m && method === "PATCH") {
        if (!requireAdmin(req, res)) return;
        const o = db.orders.find((x) => x.id === m[1]);
        if (!o) return json(res, 404, { error: "Commande introuvable" });
        const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
        if (typeof body.status === "string") o.status = body.status;
        save(DB_FILE, db);
        return json(res, 200, { order: o });
      }
    }

    // ── Contenu de site (hero, marquee) ──
    if (method === "PUT" && pathName === "/api/site") {
      if (!requireAdmin(req, res)) return;
      const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
      const site = body.site === "wellness" ? "wellness" : "shoes";
      const cur = db.site[site] || {};
      if (Array.isArray(body.hero)) {
        db.site[site] = { ...cur, hero: body.hero.map((h) => ({
          title: String(h.title || ""), subtitle: String(h.subtitle || ""),
          cta: String(h.cta || "Voir"), to: String(h.to || "/catalogue"), image: String(h.image || ""),
        })) };
      }
      if (Array.isArray(body.marquee)) {
        db.site[site] = { ...(db.site[site] || cur), marquee: body.marquee.map(String) };
      }
      save(DB_FILE, db);
      return json(res, 200, db.site[site]);
    }

    return json(res, 404, { error: `Route inconnue : ${method} ${pathName}` });
  } catch (err) {
    console.error("[omen-api]", err);
    json(res, err.code || 500, { error: err.message || "Erreur serveur" });
  }
});

server.listen(PORT, () => {
  console.log(`[omen-api] API en ligne sur http://localhost:${PORT}`);
});
