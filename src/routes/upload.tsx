import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { extractResume } from "@/lib/resume.functions";
import { RESUME_STORAGE_KEY } from "@/lib/resume";

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
      </div>
    </div>
  );
}
