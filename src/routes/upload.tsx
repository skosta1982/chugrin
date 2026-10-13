import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { FileUp, ImagePlus, Loader2, X } from "lucide-react";
import { extractResume } from "@/lib/resume.functions";
import { RESUME_STORAGE_KEY } from "@/lib/resume";
import { fileToAvatar, photoError, PHOTO_STORAGE_KEY, readStoredPhoto } from "@/lib/photo";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Загрузить резюме — сайт-визитка" },
      { name: "description", content: "Загрузите PDF-резюме, и AI заполнит опыт, навыки и контакты на сайте." },
      { property: "og:title", content: "Загрузить резюме — сайт-визитка" },
      { property: "og:description", content: "AI извлекает опыт, навыки и контакты из PDF-резюме." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Upload,
});

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function Upload() {
  const extract = useServerFn(extractResume);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoErr, setPhotoErr] = useState<string | null>(null);

  useEffect(() => setPhoto(readStoredPhoto()), []);

  async function onPhoto(file?: File) {
    if (!file) return;
    setPhotoErr(null);
    const invalid = photoError(file);
    if (invalid) return setPhotoErr(invalid);
    setPhotoBusy(true);
    try {
      const avatar = await fileToAvatar(file);
      localStorage.setItem(PHOTO_STORAGE_KEY, avatar);
      setPhoto(avatar);
    } catch (e) {
      setPhotoErr(e instanceof Error ? e.message : "Не удалось обработать фото.");
    } finally {
      setPhotoBusy(false);
    }
  }

  function dropPhoto() {
    localStorage.removeItem(PHOTO_STORAGE_KEY);
    setPhoto(null);
    setPhotoErr(null);
  }

  async function onFile(file?: File) {
    if (!file) return;
    setError(null);
    if (file.type !== "application/pdf") return setError("Нужен файл в формате PDF.");
    if (file.size > 10 * 1024 * 1024) return setError("Файл больше 10 МБ.");
    setBusy(true);
    try {
      const { resume, error } = await extract({ data: { fileName: file.name, base64: await toBase64(file) } });
      if (error || !resume) return setError(error ?? "Ошибка обработки");
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
      navigate({ to: "/" });
    } catch {
      setError("Не удалось обработать резюме. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <div className="mx-auto max-w-xl px-6 py-20">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← На сайт</Link>
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">Загрузите резюме</h1>
        <p className="mt-4 text-muted-foreground">
          AI прочитает PDF и заполнит разделы сайта: опыт, навыки и контакты.
        </p>
        <label className="mt-10 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-colors hover:bg-secondary">
          {busy ? <Loader2 className="size-8 animate-spin" /> : <FileUp className="size-8" />}
          <span className="font-medium">{busy ? "Читаю резюме… до минуты" : "Выбрать PDF-файл"}</span>
          <span className="text-sm text-muted-foreground">до 10 МБ</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <div className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold tracking-tight">Фото</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Снимок появится в шапке сайта, над вашим именем.
          </p>
          <div className="mt-5 flex items-center gap-5">
            {photo ? (
              <img
                src={photo}
                alt="Фото профиля"
                className="size-24 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
                <ImagePlus className="size-6" />
              </div>
            )}
            <div className="flex flex-col items-start gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
                {photoBusy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImagePlus className="size-4" />
                )}
                {photo ? "Заменить фото" : "Выбрать фото"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={photoBusy}
                  onChange={(e) => onPhoto(e.target.files?.[0])}
                />
              </label>
              {photo && (
                <button
                  type="button"
                  onClick={dropPhoto}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="size-3.5" />
                  Удалить фото
                </button>
              )}
            </div>
          </div>
          {photoErr && <p className="mt-4 text-sm text-destructive">{photoErr}</p>}
        </div>
      </div>
    </div>
  );
}
