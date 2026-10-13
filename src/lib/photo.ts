export const PHOTO_STORAGE_KEY = "resume-photo-v1";
export const PHOTO_MAX_SIDE = 512;
export const PHOTO_MAX_BYTES = 8 * 1024 * 1024;

export function avatarDimensions(
  width: number,
  height: number,
  maxSide = PHOTO_MAX_SIDE,
) {
  const longest = Math.max(width, height);
  if (!longest) return { width: 1, height: 1 };
  const scale = Math.min(1, maxSide / longest);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function photoError(file: { type: string; size: number }): string | null {
  if (!file.type.startsWith("image/")) return "Нужен файл изображения (JPG или PNG).";
  if (file.size > PHOTO_MAX_BYTES) return "Фото больше 8 МБ — выберите снимок поменьше.";
  return null;
}

export async function fileToAvatar(file: File, maxSide = PHOTO_MAX_SIDE): Promise<string> {
  const error = photoError(file);
  if (error) throw new Error(error);

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Не удалось прочитать изображение."));
      img.src = url;
    });

    const { width, height } = avatarDimensions(
      img.naturalWidth || img.width,
      img.naturalHeight || img.height,
      maxSide,
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Браузер не может обработать фото.");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function readStoredPhoto(): string | null {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY);
    return raw && raw.startsWith("data:image/") ? raw : null;
  } catch {
    return null;
  }
}
