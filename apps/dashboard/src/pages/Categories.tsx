import { useEffect, useState } from "react";
import { api } from "@/api";
import type { Category } from "@/types";

const STORE_CHOICES = [
  { id: "omen-shoes", label: "oMen Shoes" },
  { id: "omen-wellness", label: "oMen Wellness" },
  { id: "omen-tech", label: "oMen Tech" },
] as const;

const base = (import.meta.env.VITE_API_URL || "https://o-men-backend.vercel.app").replace(/\/+$/, "");
const resolveUrl = (u?: string) => (!u ? "" : u.startsWith("http") ? u : `${base}${u}`);

type FormState = { id: string | null; name: string; image: string; sortOrder: number };
const emptyForm: FormState = { id: null, name: "", image: "", sortOrder: 0 };

export default function CategoriesPage() {
  const [storeId, setStoreId] = useState<string>("omen-tech");
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    api
      .categories(storeId)
      .then((raw) =>
        setItems(
          raw.map((c: any) => ({
            ...c,
            image: resolveUrl(c.image),
          }))
        )
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [storeId]);

  const openCreate = () => {
    setForm({ ...emptyForm, sortOrder: items.length });
    setFormOpen(true);
  };

  const openEdit = (c: Category) => {
    setForm({ id: c.id, name: c.name, image: c.image, sortOrder: c.sortOrder });
    setFormOpen(true);
    setConfirmId(null);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        storeId,
        name: form.name.trim(),
        image: form.image.trim(),
        sortOrder: form.sortOrder,
      };
      if (form.id) {
        await api.updateCategory(form.id, payload);
      } else {
        await api.createCategory(payload);
      }
      closeForm();
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.deleteCategory(id);
      setItems((xs) => xs.filter((x) => x.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setConfirmId(null);
  };

  const toggleActive = async (c: Category) => {
    try {
      await api.updateCategory(c.id, { active: !c.active });
      setItems((xs) => xs.map((x) => (x.id === c.id ? { ...x, active: !c.active } : x)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const uploadImage = async () => {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "image/*";
    picker.onchange = async () => {
      const file = picker.files?.[0];
      if (!file) return;
      setUploading(true);
      setError("");
      try {
        const result = await api.uploadFiles([file]);
        const urls: string[] = result.urls || [];
        if (urls[0]) setForm((f) => ({ ...f, image: resolveUrl(urls[0]) }));
      } catch {
        setError("Erreur lors de l'envoi de l'image");
      } finally {
        setUploading(false);
      }
    };
    picker.click();
  };

  return (
    <div>
      {/* Titre desktop */}
      <div className="mb-5 hidden items-end justify-between gap-3 sm:flex">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">Catégories</h1>
          <p className="mt-0.5 text-[13px] text-[#777]">
            Briques de la page d&rsquo;accueil et onglets du catalogue.
          </p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-sm">
          + Ajouter une catégorie
        </button>
      </div>

      {/* Sélecteur de boutique */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STORE_CHOICES.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setStoreId(s.id);
              closeForm();
              setConfirmId(null);
            }}
            className={`chip ${storeId === s.id ? "chip-active" : ""}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-600">{error}</div>
      )}

      {/* Bouton mobile */}
      <div className="mb-4 sm:hidden">
        <button onClick={openCreate} className="btn btn-primary w-full">
          + Ajouter une catégorie
        </button>
      </div>

      {/* Formulaire */}
      {formOpen && (
        <div className="card mb-5 p-4">
          <p className="text-[15px] font-semibold">
            {form.id ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12.5px] font-medium text-[#666]">Nom</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ex. Smartphones"
                className="input mt-1"
              />
            </label>
            <label className="block">
              <span className="text-[12.5px] font-medium text-[#666]">Ordre d&rsquo;affichage</span>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
                }
                className="input mt-1"
              />
            </label>
          </div>

          <div className="mt-3">
            <span className="text-[12.5px] font-medium text-[#666]">Image de la brique</span>
            <div className="mt-1 flex gap-2">
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="…ou coller un lien d'image"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={uploadImage}
                disabled={uploading}
                className="btn btn-dark btn-sm"
              >
                {uploading ? "Envoi…" : "Choisir"}
              </button>
            </div>
            {form.image && (
              <img
                src={form.image}
                alt=""
                className="mt-2 h-20 w-32 rounded-xl border border-black/10 bg-[#eee] object-cover"
              />
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={save}
              disabled={saving || !form.name.trim()}
              className="btn btn-primary btn-sm"
            >
              {saving ? "Enregistrement…" : form.id ? "Enregistrer" : "Créer la catégorie"}
            </button>
            <button onClick={closeForm} className="btn btn-outline btn-sm">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card flex items-center gap-3 p-3">
              <div className="skeleton h-14 w-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-40" />
                <div className="skeleton h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[15px] text-[#888]">Aucune catégorie dans cette boutique.</p>
          <button onClick={openCreate} className="btn btn-primary btn-sm mt-4">
            + Ajouter une catégorie
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div key={c.id} className="card animate-fade-in-up flex items-center gap-3 p-3">
              <img
                src={c.image || undefined}
                alt=""
                className="h-14 w-20 shrink-0 rounded-xl border border-black/5 bg-[#eee] object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{c.name}</p>
                <p className="mt-0.5 text-[12.5px] text-[#888]">
                  Position {c.sortOrder + 1} · {STORE_CHOICES.find((s) => s.id === c.storeId)?.label || c.storeId}
                </p>
              </div>

              {confirmId === c.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#666]">Supprimer ?</span>
                  <button onClick={() => remove(c.id)} className="btn btn-sm btn-dark">
                    Oui
                  </button>
                  <button onClick={() => setConfirmId(null)} className="btn btn-sm btn-outline">
                    Non
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`btn btn-sm ${c.active ? "btn-outline" : "btn-dark"}`}
                  >
                    {c.active ? "En ligne" : "Masqué"}
                  </button>
                  <button onClick={() => openEdit(c)} className="btn btn-sm btn-primary">
                    Modifier
                  </button>
                  <button
                    onClick={() => setConfirmId(c.id)}
                    className="btn btn-sm btn-outline"
                    aria-label={`Supprimer ${c.name}`}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
