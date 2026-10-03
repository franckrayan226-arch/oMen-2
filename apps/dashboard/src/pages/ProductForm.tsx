import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { ProductFormData, ColorDef, ImageDef, VariantDef } from "../types";
import { DEFAULT_SIZES_SHOES, DEFAULT_SIZES_APPAREL } from "../types";

const SHOES_CATEGORIES = [
  "Sneakers",
  "Baskets",
  "Running",
  "Lifestyle",
  "Limited Edition",
  "Kids",
];

const WELLNESS_CATEGORIES = [
  "Compléments",
  "Huiles Essentielles",
  "Aromathérapie",
  "Bien-être",
  "Soin",
  "Accessoires",
];

const TECH_CATEGORIES = [
  "Smartphones",
  "Ordinateurs",
  "Audio",
  "Tablettes",
  "Accessoires",
  "Montres",
  "Gaming",
  "Réseau",
];

const STORE_CHOICES = [
  { id: "omen-shoes", label: "oMen Shoes", hint: "Sneakers & mode" },
  { id: "omen-wellness", label: "oMen Wellness", hint: "Bien-être" },
  { id: "omen-tech", label: "oMen Tech", hint: "High-tech" },
] as const;

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [storeId, setStoreId] = useState("omen-shoes");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [compareAt, setCompareAt] = useState<number | null>(null);
  const [category, setCategory] = useState("Sneakers");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState("");
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [colors, setColors] = useState<ColorDef[]>([]);
  const [globalImages, setGlobalImages] = useState<ImageDef[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const siteKey =
    storeId === "omen-shoes" ? "shoes" : storeId === "omen-tech" ? "tech" : "wellness";
  const defaultSizes =
    siteKey === "shoes" ? DEFAULT_SIZES_SHOES : siteKey === "tech" ? ["Standard"] : DEFAULT_SIZES_APPAREL;
  const categories =
    siteKey === "shoes" ? SHOES_CATEGORIES : siteKey === "tech" ? TECH_CATEGORIES : WELLNESS_CATEGORIES;

  // Suggestions de marques existantes pour cette boutique
  const [existingBrands, setExistingBrands] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    api
      .products(storeId)
      .then((list: any[]) => {
        if (!alive) return;
        const set = new Set<string>();
        list.forEach((p) => {
          const b = (p.brand || "").trim();
          if (b) set.add(b);
        });
        setExistingBrands(Array.from(set).sort());
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [storeId]);

  // Charger un produit existant (édition)
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .productAdmin(id)
      .then((p: any) => {
        setStoreId(p.storeId || "omen-shoes");
        setName(p.name || "");
        setSlug(p.slug || "");
        setDescription(p.description || "");
        setPrice(p.price || 0);
        setCompareAt(p.compareAt || null);
        setCategory(p.category || "");
        setBrand(p.brand || "");
        setTags(Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "");
        setActive(p.active ?? true);
        setFeatured(p.featured ?? false);
        if ((p.colors || []).length > 0 || (p.images || []).length > 0) setShowAdvanced(true);

        const loadedColors: ColorDef[] = (p.colors || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          hex: c.hex,
          sortOrder: c.sortOrder,
          images: (c.images || []).map((img: any) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
            isMain: img.isMain,
            colorId: c.id,
          })),
          variants: (p.variants || [])
            .filter((v: any) => v.colorId === c.id)
            .map((v: any) => ({
              id: v.id,
              colorId: c.id,
              size: v.size,
              sku: v.sku,
              price: v.price,
              compareAt: v.compareAt,
              stock: v.stock,
              active: v.active,
            })),
        }));
        setColors(loadedColors);

        const imgs: ImageDef[] = (p.images || []).map((img: any) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
          isMain: img.isMain,
        }));
        setGlobalImages(imgs);
      })
      .catch(() => setError("Erreur lors du chargement du produit"))
      .finally(() => setLoading(false));
  }, [id]);

  // Slug automatique
  useEffect(() => {
    if (!isEdit) setSlug(slugify(name));
  }, [name, isEdit]);

  // ── COLORIS ──
  const addColor = () =>
    setColors((prev) => [...prev, { name: "", hex: "#000000", images: [], variants: [] }]);
  const updateColor = (idx: number, patch: Partial<ColorDef>) =>
    setColors((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  const removeColor = (idx: number) =>
    setColors((prev) => prev.filter((_, i) => i !== idx));

  // ── IMAGES ──
  const addImageUrl = (colorIdx: number | null, url: string) => {
    if (!url.trim()) return;
    const img: ImageDef = { url: url.trim(), isMain: false, sortOrder: 0 };
    if (colorIdx === null) {
      setGlobalImages((prev) => [...prev, img]);
    } else {
      setColors((prev) =>
        prev.map((c, i) =>
          i === colorIdx ? { ...c, images: [...(c.images || []), img] } : c
        )
      );
    }
    setUrlInput("");
  };

  const removeImage = (colorIdx: number | null, imgIdx: number) => {
    if (colorIdx === null) {
      setGlobalImages((prev) => prev.filter((_, i) => i !== imgIdx));
    } else {
      setColors((prev) =>
        prev.map((c, i) =>
          i === colorIdx
            ? { ...c, images: (c.images || []).filter((_, j) => j !== imgIdx) }
            : c
        )
      );
    }
  };

  const moveImage = (colorIdx: number | null, imgIdx: number, dir: -1 | 1) => {
    const swap = (arr: ImageDef[]) => {
      const copy = [...arr];
      const newIdx = imgIdx + dir;
      if (newIdx < 0 || newIdx >= copy.length) return arr;
      [copy[imgIdx], copy[newIdx]] = [copy[newIdx], copy[imgIdx]];
      return copy;
    };
    if (colorIdx === null) {
      setGlobalImages((prev) => swap(prev));
    } else {
      setColors((prev) =>
        prev.map((c, i) => (i === colorIdx ? { ...c, images: swap(c.images || []) } : c))
      );
    }
  };

  const uploadFiles = async (colorIdx: number | null, files: FileList) => {
    setUploading(true);
    try {
      const result = await api.uploadFiles(Array.from(files));
      const urls: string[] = result.urls || [];
      const base = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
      urls.forEach((url) => {
        addImageUrl(colorIdx, url.startsWith("http") ? url : `${base}${url}`);
      });
    } catch {
      setError("Erreur lors de l'envoi des photos");
    } finally {
      setUploading(false);
    }
  };

  // ── VARIANTES (tailles / stock) ──
  const addVariant = (colorIdx: number) => {
    const newVariant: VariantDef = {
      size: defaultSizes[0],
      stock: 0,
      price: undefined,
      active: true,
    };
    setColors((prev) =>
      prev.map((c, i) =>
        i === colorIdx
          ? { ...c, variants: [...(c.variants || []), newVariant] }
          : c
      )
    );
  };

  const updateVariant = (colorIdx: number, varIdx: number, patch: Partial<VariantDef>) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === colorIdx
          ? {
              ...c,
              variants: (c.variants || []).map((v, j) => (j === varIdx ? { ...v, ...patch } : v)),
            }
          : c
      )
    );
  };

  const removeVariant = (colorIdx: number, varIdx: number) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === colorIdx ? { ...c, variants: (c.variants || []).filter((_, j) => j !== varIdx) } : c
      )
    );
  };

  // ── ENREGISTREMENT ──
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body: ProductFormData = {
        storeId,
        name,
        slug,
        description,
        price,
        compareAt,
        category,
        brand: brand.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        active,
        featured,
        colors: colors.map((c, ci) => ({
          name: c.name,
          hex: c.hex,
          sortOrder: ci,
          images: (c.images || []).map((img, ii) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: ii,
            isMain: ii === 0,
          })),
          variants: (c.variants || []).map((v) => ({
            size: v.size,
            sku: v.sku,
            price: v.price,
            compareAt: v.compareAt,
            stock: v.stock ?? 0,
            active: v.active ?? true,
          })),
        })),
        images: globalImages.map((img, ii) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: ii,
          isMain: ii === 0,
        })),
        variants: [],
      };

      if (isEdit && id) {
        await api.updateProduct(id, body);
      } else {
        await api.createProduct(body);
      }
      navigate("/produits");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#1d4ed8] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Retour (toutes tailles) */}
      <button
        type="button"
        onClick={() => navigate("/produits")}
        className="mb-4 hidden items-center gap-1.5 text-[14px] font-semibold text-[#666] transition hover:text-[#111] sm:flex"
      >
        &larr; Retour aux produits
      </button>
      <h1 className="mb-5 hidden text-[24px] font-extrabold tracking-tight sm:block">
        {isEdit ? "Modifier le produit" : "Nouveau produit"}
      </h1>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── 1. BOUTIQUE ── */}
        <Section num="1" title="Dans quelle boutique ?">
          <div className="grid grid-cols-3 gap-2">
            {STORE_CHOICES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setStoreId(s.id);
                  setCategory(
                    s.id === "omen-shoes" ? "Sneakers" : s.id === "omen-tech" ? "Smartphones" : "Compléments"
                  );
                }}
                className={`flex min-h-[64px] flex-col items-center justify-center gap-0.5 rounded-2xl border-2 px-2 text-center transition ${
                  storeId === s.id
                    ? "border-[#1d4ed8] bg-blue-50 text-[#1d4ed8]"
                    : "border-black/10 bg-white text-[#444] hover:border-black/25"
                }`}
              >
                <span className="text-[14px] font-bold">{s.label.replace("oMen ", "")}</span>
                <span className="text-[11px] opacity-70">{s.hint}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ── 2. INFOS ── */}
        <Section num="2" title="Le produit">
          <div className="space-y-4">
            <Field label="Nom du produit">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Ex : Nike Air Max 90"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Prix (FCFA)">
                <input
                  type="number"
                  inputMode="numeric"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="input"
                  min={0}
                  placeholder="0"
                  required
                />
              </Field>
              <Field label="Prix barré">
                <input
                  type="number"
                  inputMode="numeric"
                  value={compareAt ?? ""}
                  onChange={(e) => setCompareAt(e.target.value ? Number(e.target.value) : null)}
                  className="input"
                  min={0}
                  placeholder="Optionnel"
                />
              </Field>
            </div>

            <Field label="Catégorie">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Marque">
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="input"
                placeholder="ex : iPhone, Samsung, JBL…"
                list="brand-suggestions"
              />
              <datalist id="brand-suggestions">
                {(existingBrands || []).map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                rows={4}
                placeholder="Décrivez le produit simplement…"
              />
            </Field>
          </div>
        </Section>

        {/* ── 3. PHOTOS ── */}
        <Section num="3" title="Les photos">
          <ImageSection
            images={globalImages}
            colorIdx={null}
            onAddUrl={addImageUrl}
            onRemove={removeImage}
            onMove={moveImage}
            onUpload={uploadFiles}
            uploading={uploading}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
          />
        </Section>

        {/* ── OPTIONS AVANCÉES ── */}
        <div className="card overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex min-h-[60px] w-full items-center justify-between px-4 text-left sm:px-5"
          >
            <span>
              <span className="block text-[15px] font-bold">Options avancées</span>
              <span className="block text-[12.5px] text-[#888]">
                Lien, tags, coloris, tailles, mise en avant
              </span>
            </span>
            <svg
              className={`h-5 w-5 shrink-0 text-[#888] transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="space-y-4 border-t border-black/[0.07] px-4 pb-5 pt-4 sm:px-5">
              <Field label="Lien du produit (URL)">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="input"
                  placeholder="nike-air-max-90"
                />
                <p className="mt-1.5 text-[12px] text-[#999]">
                  Généré automatiquement depuis le nom.
                </p>
              </Field>

              <Field label="Tags (séparés par des virgules)">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="input"
                  placeholder="tendance, sport, limited"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Toggle
                  label="En ligne"
                  hint="Visible sur le site"
                  checked={active}
                  onChange={setActive}
                />
                <Toggle
                  label="Vedette"
                  hint="En page d'accueil"
                  checked={featured}
                  onChange={setFeatured}
                />
              </div>

              {/* Coloris */}
              <div className="pt-1">
                <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-[#666]">
                  Coloris &amp; tailles
                </p>
                <div className="space-y-3">
                  {colors.map((color, ci) => (
                    <div key={ci} className="rounded-2xl border border-black/10 bg-[#fafafa] p-3.5">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          value={color.hex}
                          onChange={(e) => updateColor(ci, { hex: e.target.value })}
                          className="h-11 w-11 shrink-0 cursor-pointer rounded-xl border border-black/10 bg-white"
                          aria-label="Couleur"
                        />
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => updateColor(ci, { name: e.target.value })}
                          className="input flex-1"
                          placeholder="Nom (ex : Noir)"
                        />
                        <button
                          type="button"
                          onClick={() => removeColor(ci)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#999] transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Supprimer ce coloris"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-3">
                        <p className="mb-2 text-[12.5px] font-semibold text-[#666]">
                          Photos de ce coloris
                        </p>
                        <ImageSection
                          images={color.images || []}
                          colorIdx={ci}
                          onAddUrl={addImageUrl}
                          onRemove={removeImage}
                          onMove={moveImage}
                          onUpload={uploadFiles}
                          uploading={uploading}
                          urlInput={urlInput}
                          setUrlInput={setUrlInput}
                        />
                      </div>

                      <div className="mt-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-[12.5px] font-semibold text-[#666]">Tailles &amp; stock</p>
                          <button
                            type="button"
                            onClick={() => addVariant(ci)}
                            className="text-[13px] font-bold text-[#1d4ed8] underline underline-offset-2"
                          >
                            + Ajouter une taille
                          </button>
                        </div>
                        {(color.variants || []).length > 0 ? (
                          <div className="space-y-2">
                            {(color.variants || []).map((v, vi) => (
                              <div
                                key={vi}
                                className="grid grid-cols-2 gap-2 rounded-xl bg-white p-2.5 sm:grid-cols-[1fr_1fr_1fr_auto]"
                              >
                                <select
                                  value={v.size}
                                  onChange={(e) => updateVariant(ci, vi, { size: e.target.value })}
                                  className="input !min-h-[44px] !py-1.5 text-[14px]"
                                  aria-label="Taille"
                                >
                                  {defaultSizes.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  value={v.stock ?? 0}
                                  onChange={(e) =>
                                    updateVariant(ci, vi, { stock: Number(e.target.value) })
                                  }
                                  className="input !min-h-[44px] !py-1.5 text-[14px]"
                                  min={0}
                                  placeholder="Stock"
                                  aria-label="Stock"
                                />
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  value={v.price ?? ""}
                                  onChange={(e) =>
                                    updateVariant(ci, vi, {
                                      price: e.target.value ? Number(e.target.value) : undefined,
                                    })
                                  }
                                  className="input !min-h-[44px] !py-1.5 text-[14px]"
                                  min={0}
                                  placeholder="Prix"
                                  aria-label="Prix"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVariant(ci, vi)}
                                  className="col-span-2 flex min-h-[40px] items-center justify-center rounded-xl text-[#b91c1c] transition hover:bg-red-50 sm:col-span-1"
                                  aria-label="Supprimer la taille"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="rounded-xl bg-white px-3 py-2.5 text-[12.5px] text-[#999]">
                            Pas encore de taille ajoutée.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addColor}
                    className="w-full rounded-2xl border-2 border-dashed border-black/15 py-3.5 text-[14px] font-bold text-[#666] transition hover:border-[#1d4ed8] hover:text-[#1d4ed8]"
                  >
                    + Ajouter un coloris
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* ── Barre d'enregistrement (collée en bas) ── */}
      <div className="savebar">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-0">
          <button
            type="button"
            onClick={() => navigate("/produits")}
            className="btn btn-outline flex-1"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="btn btn-primary flex-[2]"
          >
            {saving ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SOUS-COMPOSANTS ──

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <h2 className="mb-4 flex items-center gap-2.5 text-[16px] font-extrabold tracking-tight">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111] text-[12px] font-bold text-white">
          {num}
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[14px] font-semibold text-[#444]">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex min-h-[64px] w-full flex-col items-start justify-center gap-1 rounded-2xl border-2 px-3.5 text-left transition ${
        checked ? "border-[#1d4ed8] bg-blue-50" : "border-black/10 bg-white"
      }`}
    >
      <span className="flex w-full items-center justify-between">
        <span className="text-[14px] font-bold">{label}</span>
        <span
          className={`relative h-6 w-11 rounded-full transition ${
            checked ? "bg-[#1d4ed8]" : "bg-black/15"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              checked ? "left-[22px]" : "left-0.5"
            }`}
          />
        </span>
      </span>
      <span className="text-[11.5px] text-[#888]">{hint}</span>
    </button>
  );
}

function ImageSection({
  images,
  colorIdx,
  onAddUrl,
  onRemove,
  onMove,
  onUpload,
  uploading,
  urlInput,
  setUrlInput,
}: {
  images: ImageDef[];
  colorIdx: number | null;
  onAddUrl: (colorIdx: number | null, url: string) => void;
  onRemove: (colorIdx: number | null, imgIdx: number) => void;
  onMove: (colorIdx: number | null, imgIdx: number, dir: -1 | 1) => void;
  onUpload: (colorIdx: number | null, files: FileList) => void;
  uploading: boolean;
  urlInput: string;
  setUrlInput: (v: string) => void;
}) {
  const pickFiles = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files?.length) onUpload(colorIdx, files);
    };
    input.click();
  }, [colorIdx, onUpload]);

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img, ii) => (
            <div key={ii} className="relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-[#f1f1ef]">
              <img src={img.url} alt={img.alt || ""} className="h-full w-full object-cover" />
              {ii === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-md bg-[#111] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white">
                  Principale
                </span>
              )}
              {/* Contrôles toujours visibles (mobile = pas de survol) */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => onMove(colorIdx, ii, -1)}
                  disabled={ii === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-white/20 disabled:opacity-30"
                  aria-label="Reculer"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(colorIdx, ii)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-300 transition hover:bg-red-500/40 hover:text-white"
                  aria-label="Supprimer la photo"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => onMove(colorIdx, ii, 1)}
                  disabled={ii === images.length - 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-white/20 disabled:opacity-30"
                  aria-label="Avancer"
                >
                  &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={pickFiles}
        disabled={uploading}
        className="btn btn-outline w-full border-dashed"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {uploading ? "Envoi en cours…" : "Choisir des photos"}
      </button>

      <div className="mt-2 flex gap-2">
        <input
          type="url"
          inputMode="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddUrl(colorIdx, urlInput);
            }
          }}
          className="input flex-1 !min-h-[48px] text-[14px]"
          placeholder="…ou coller un lien d'image"
        />
        <button
          type="button"
          onClick={() => onAddUrl(colorIdx, urlInput)}
          disabled={!urlInput.trim()}
          className="btn btn-dark btn-sm"
        >
          Ajouter
        </button>
      </div>

      <p className="mt-2 text-[12px] text-[#999]">
        La première photo est affichée en premier. Glissez avec les flèches pour changer l&rsquo;ordre.
      </p>
    </div>
  );
}
