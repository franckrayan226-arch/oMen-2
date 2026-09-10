import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { ProductFormData, ColorDef, ImageDef, VariantDef } from "../types";
import { STORES, DEFAULT_SIZES_SHOES, DEFAULT_SIZES_APPAREL } from "../types";

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

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

let colorIdx = 0;
let imgIdx = 0;
let varIdx = 0;
function cuid(tag: string) {
  return `${tag}_${Date.now()}_${++colorIdx}`;
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

  const siteKey = storeId === "omen-shoes" ? "shoes" : "wellness";
  const defaultSizes = siteKey === "shoes" ? DEFAULT_SIZES_SHOES : DEFAULT_SIZES_APPAREL;
  const categories = siteKey === "shoes" ? SHOES_CATEGORIES : WELLNESS_CATEGORIES;

  // Load existing product for edit
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
        setTags(p.tags?.join(", ") || "");
        setActive(p.active ?? true);
        setFeatured(p.featured ?? false);

        // Colors
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

        // Global images
        const imgs: ImageDef[] = (p.images || []).map((img: any) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
          isMain: img.isMain,
        }));
        setGlobalImages(imgs);

        // Global variants (no color)
        const globalVars: VariantDef[] = (p.variants || [])
          .filter((v: any) => !v.colorId)
          .map((v: any) => ({
            id: v.id,
            size: v.size,
            sku: v.sku,
            price: v.price,
            compareAt: v.compareAt,
            stock: v.stock,
            active: v.active,
          }));
        setGlobalImages(imgs);
      })
      .catch(() => setError("Erreur lors du chargement du produit"))
      .finally(() => setLoading(false));
  }, [id]);

  // Auto slug
  useEffect(() => {
    if (!isEdit) setSlug(slugify(name));
  }, [name, isEdit]);

  // ── COLOR MANAGEMENT ──
  const addColor = () => {
    setColors((prev) => [
      ...prev,
      { name: "", hex: "#000000", images: [], variants: [] },
    ]);
  };
  const updateColor = (idx: number, patch: Partial<ColorDef>) => {
    setColors((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };
  const removeColor = (idx: number) => {
    setColors((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── IMAGE MANAGEMENT ──
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
    if (colorIdx === null) {
      setGlobalImages((prev) => {
        const arr = [...prev];
        const newIdx = imgIdx + dir;
        if (newIdx < 0 || newIdx >= arr.length) return prev;
        [arr[imgIdx], arr[newIdx]] = [arr[newIdx], arr[imgIdx]];
        return arr;
      });
    } else {
      setColors((prev) =>
        prev.map((c, i) => {
          if (i !== colorIdx) return c;
          const arr = [...(c.images || [])];
          const newIdx = imgIdx + dir;
          if (newIdx < 0 || newIdx >= arr.length) return c;
          [arr[imgIdx], arr[newIdx]] = [arr[newIdx], arr[imgIdx]];
          return { ...c, images: arr };
        })
      );
    }
  };

  const uploadFiles = async (colorIdx: number | null, files: FileList) => {
    setUploading(true);
    try {
      const result = await api.uploadFiles(Array.from(files));
      const urls: string[] = result.urls || [];
      urls.forEach((url) => {
        if (url.startsWith("http")) {
          addImageUrl(colorIdx, url);
        } else {
          addImageUrl(colorIdx, `${(import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "")}${url}`);
        }
      });
    } catch {
      setError("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  // ── VARIANT MANAGEMENT ──
  const addVariant = (colorIdx: number | null) => {
    const newVariant: VariantDef = {
      size: defaultSizes[0],
      stock: 0,
      price: undefined,
      active: true,
    };
    if (colorIdx === null) {
      // Will be added after save
    } else {
      setColors((prev) =>
        prev.map((c, i) =>
          i === colorIdx
            ? { ...c, variants: [...(c.variants || []), newVariant] }
            : c
        )
      );
    }
  };

  const updateVariant = (
    colorIdx: number,
    varIdx: number,
    patch: Partial<VariantDef>
  ) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === colorIdx
          ? {
              ...c,
              variants: (c.variants || []).map((v, j) =>
                j === varIdx ? { ...v, ...patch } : v
              ),
            }
          : c
      )
    );
  };

  const removeVariant = (colorIdx: number, varIdx: number) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === colorIdx
          ? { ...c, variants: (c.variants || []).filter((_, j) => j !== varIdx) }
          : c
      )
    );
  };

  // ── SAVE ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/produits")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          ← Retour
        </button>
        <h1 className="font-display text-xl font-semibold">
          {isEdit ? "Modifier le produit" : "Nouveau produit"}
        </h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── STORE SELECT ── */}
        <Section title="Boutique">
          <div className="flex gap-3">
            {(["omen-shoes", "omen-wellness"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStoreId(s);
                  setCategory(
                    s === "omen-shoes" ? "Sneakers" : "Compléments"
                  );
                }}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition ${
                  storeId === s
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {s === "omen-shoes" ? "oMen Shoes" : "oMen Wellness"}
              </button>
            ))}
          </div>
        </Section>

        {/* ── GENERAL INFO ── */}
        <Section title="Informations générales">
          <div className="space-y-4">
            <Field label="Nom du produit">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full"
                placeholder="Ex: Nike Air Max 90"
                required
              />
            </Field>

            <Field label="Slug URL">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="input w-full"
                placeholder="nike-air-max-90"
              />
              <p className="mt-1 text-xs text-gray-500">
                Auto-généré depuis le nom. Utilisé dans l'URL.
              </p>
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input w-full"
                rows={4}
                placeholder="Description du produit..."
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Prix (FCFA)">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="input w-full"
                  min={0}
                  required
                />
              </Field>
              <Field label="Prix barré (FCFA)">
                <input
                  type="number"
                  value={compareAt ?? ""}
                  onChange={(e) =>
                    setCompareAt(e.target.value ? Number(e.target.value) : null)
                  }
                  className="input w-full"
                  min={0}
                  placeholder="Optionnel"
                />
              </Field>
            </div>

            <Field label="Catégorie">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input w-full"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tags (séparés par des virgules)">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input w-full"
                placeholder="tendance, sport, limited"
              />
            </Field>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Actif
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Vedette
              </label>
            </div>
          </div>
        </Section>

        {/* ── GLOBAL IMAGES ── */}
        <Section title="Images du produit">
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

        {/* ── COLORS ── */}
        <Section title="Coloris">
          <div className="space-y-4">
            {colors.map((color, ci) => (
              <div
                key={ci}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(ci, { hex: e.target.value })}
                    className="h-8 w-8 cursor-pointer rounded border-0"
                  />
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(ci, { name: e.target.value })}
                    className="input flex-1"
                    placeholder="Nom du coloris (ex: Noir, Chicago)"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(ci)}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Color images */}
                <div className="mb-3">
                  <p className="mb-2 text-xs font-medium text-gray-600">
                    Images de ce coloris
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

                {/* Variants for this color */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-600">
                      Tailles / Stock
                    </p>
                    <button
                      type="button"
                      onClick={() => addVariant(ci)}
                      className="text-xs font-medium text-[var(--brand)] hover:underline"
                    >
                      + Ajouter une taille
                    </button>
                  </div>
                  {(color.variants || []).length > 0 ? (
                    <div className="space-y-2">
                      {(color.variants || []).map((v, vi) => (
                        <div
                          key={vi}
                          className="flex items-center gap-2 rounded-md bg-white p-2"
                        >
                          <select
                            value={v.size}
                            onChange={(e) =>
                              updateVariant(ci, vi, { size: e.target.value })
                            }
                            className="input w-20 text-sm"
                          >
                            {defaultSizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={v.stock ?? 0}
                            onChange={(e) =>
                              updateVariant(ci, vi, {
                                stock: Number(e.target.value),
                              })
                            }
                            className="input w-20 text-sm"
                            min={0}
                            placeholder="Stock"
                          />
                          <input
                            type="number"
                            value={v.price ?? ""}
                            onChange={(e) =>
                              updateVariant(ci, vi, {
                                price: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="input w-24 text-sm"
                            min={0}
                            placeholder="Prix"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariant(ci, vi)}
                            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Aucune taille. Ajoutez des tailles pour gérer le stock.
                    </p>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addColor}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              + Ajouter un coloris
            </button>
          </div>
        </Section>

        {/* ── ACTIONS ── */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/produits")}
            className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-[var(--brand)] py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving
              ? "Sauvegarde..."
              : isEdit
              ? "Modifier"
              : "Créer le produit"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── SUB COMPONENTS ──

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-3 font-display text-sm font-semibold text-gray-900">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
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
  const fileRef = useCallback(
    () => document.createElement("input"),
    []
  );

  return (
    <div>
      {/* Image grid */}
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img, ii) => (
            <div
              key={ii}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
            >
              <img
                src={img.url}
                alt={img.alt || ""}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                {ii > 0 && (
                  <button
                    type="button"
                    onClick={() => onMove(colorIdx, ii, -1)}
                    className="rounded bg-white/80 p-1 text-xs hover:bg-white"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(colorIdx, ii)}
                  className="rounded bg-red-500 p-1 text-xs text-white hover:bg-red-600"
                >
                  ✕
                </button>
                {ii < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => onMove(colorIdx, ii, 1)}
                    className="rounded bg-white/80 p-1 text-xs hover:bg-white"
                  >
                    →
                  </button>
                )}
              </div>
              {ii === 0 && (
                <span className="absolute left-1 top-1 rounded bg-[var(--brand)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add image controls */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddUrl(colorIdx, urlInput);
            }
          }}
          className="input flex-1 text-sm"
          placeholder="URL de l'image..."
        />
        <button
          type="button"
          onClick={() => onAddUrl(colorIdx, urlInput)}
          disabled={!urlInput.trim()}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files?.length) onUpload(colorIdx, files);
            };
            input.click();
          }}
          disabled={uploading}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? "..." : "Fichier"}
        </button>
      </div>
    </div>
  );
}