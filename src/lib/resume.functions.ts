import { createServerFn } from "@tanstack/react-start";
import { resumeJsonSchema, type Resume } from "./resume";

const PROMPT = `Извлеки данные из резюме. Пиши на языке резюме.
name — полное имя; title — желаемая должность; location — город;
summary — 2–3 предложения о кандидате; email, phone — контакты (пустая строка, если нет);
links — ссылки (сайт, Telegram, GitHub и т.п.);
experience — места работы от новых к старым: period (например «2021 — н.в.»), role, company, text — краткое описание обязанностей и достижений;
skills — до 15 ключевых навыков. Ничего не выдумывай.`;

export const extractResume = createServerFn({ method: "POST" })
  .inputValidator((d: { fileName: string; base64: string }) => {
    if (!d?.base64 || d.base64.length > 14_000_000) throw new Error("Файл пустой или больше 10 МБ");
    return d;
  })
  .handler(async ({ data }): Promise<{ resume: Resume | null; error: string | null }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { resume: null, error: "AI не настроен" };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        text: { format: { type: "json_schema", name: "resume", strict: true, schema: resumeJsonSchema } },
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_file",
                filename: data.fileName || "resume.pdf",
                file_data: `data:application/pdf;base64,${data.base64}`,
              },
              { type: "input_text", text: PROMPT },
            ],
          },
        ],
      }),
    });

    if (!res.ok || !res.body) {
      const body = await res.text().catch(() => "");
      console.error("AI gateway error", res.status, body);
      let msg = "Не удалось обработать резюме. Попробуйте позже.";
      if (res.status === 402) msg = "Закончились AI-кредиты.";
      if (res.status === 429) msg = "Слишком много запросов, попробуйте через минуту.";
      try {
        const m = JSON.parse(body)?.error?.message ?? JSON.parse(body)?.message;
        if (m && res.status < 500) msg = m;
      } catch {}
      return { resume: null, error: msg };
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    let failure: string | null = null;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n\n")) >= 0) {
        const frame = buf.slice(0, i);
        buf = buf.slice(i + 2);
        for (const line of frame.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const ev = JSON.parse(payload);
            if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
            else if (ev.type === "response.refusal.delta") failure = "Модель отказалась обрабатывать файл.";
            else if (ev.type === "error" || ev.type === "response.failed")
              failure = ev.error?.message ?? ev.response?.error?.message ?? "Ошибка обработки";
          } catch {}
        }
      }
    }
    if (failure) return { resume: null, error: failure };
    try {
      return { resume: JSON.parse(text) as Resume, error: null };
    } catch {
      return { resume: null, error: "Не удалось распознать ответ модели." };
    }
  });
