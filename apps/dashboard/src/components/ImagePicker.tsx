import { useRef, useState } from "react";
import { api } from "@/api";

interface Props {
  images: string[];
  onChange: (urls: string[]) => void;
  site: string; // "shoes" | "wellness"
  label?: string;
}

export function ImagePicker({ images, onChange, site, label = "Images" }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const addUrls = (urls: string[]) => onChange([...images, ...urls]);

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setError("");
    setBusy(true);
    try {
      const r = await api.uploadFiles(Array.from(files), site);
      addUrls(r.uploads.map((u: { url: string }) => u.url));
    } catch (e: any) {
      setError(e.message || "Import impossible");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const importLink = async () => {
    const link = url.trim();
    if (!link) return;
    setError("");
    setBusy(true);
    try {
      const r = await api.importUrl(link, site);
      addUrls(r.uploads.map((u: { url: string }) => u.url));
      setUrl("");
    } catch (e: any) {
      setError(e.message || "Import impossible");
    } finally {
      setBusy(false);
    }
  };

  const remove = (i: number) => onChange(images.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#444]">{label}</p>

      {images.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div key={src + i} className="group relative h-20 w-20 overflow-hidden rounded-xl bg-[#f1f1ef] ring-1 ring-black/[0.08]">
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
                  Principale
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-1 py-0.5 opacity-0 transition group-hover:opacity-100">
                <button type="button" onClick={() => move(i, -1)} className="px-1 text-[11px] text-white/90 hover:text-white" title="Reculer">
                  ←
                </button>
                <button type="button" onClick={() => remove(i)} className="px-1 text-[11px] font-bold text-red-300 hover:text-red-200" title="Retirer">
                  ✕
                </button>
                <button type="button" onClick={() => move(i, 1)} className="px-1 text-[11px] text-white/90 hover:text-white" title="Avancer">
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 bg-white px-4 py-2.5 text-[12.5px] font-medium text-[#444] transition hover:border-[#1d4ed8] hover:text-[#1d4ed8] disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Importer depuis l'appareil
        </button>
        <div className="flex flex-1 gap-1.5">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), importLink())}
            placeholder="…ou coller un lien web (https://…)"
            className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[12.5px] outline-none transition focus:border-[#1d4ed8]"
          />
          <button
            type="button"
            onClick={importLink}
            disabled={busy || !url.trim()}
            className="rounded-xl bg-[#111] px-3.5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-black active:scale-[0.98] disabled:opacity-40"
          >
            Ajouter
          </button>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />

      {busy && <p className="mt-1.5 text-[11.5px] text-[#1d4ed8]">Import en cours…</p>}
      {error && <p className="mt-1.5 text-[11.5px] text-red-600">{error}</p>}
      <p className="mt-1.5 text-[10.5px] text-[#999]">La première image est la photo principale. Plusieurs fichiers à la fois acceptés.</p>
    </div>
  );
}
