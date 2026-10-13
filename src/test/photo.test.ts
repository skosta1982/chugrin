import { describe, expect, it } from "vitest";

import {
  avatarDimensions,
  PHOTO_MAX_BYTES,
  PHOTO_MAX_SIDE,
  photoError,
} from "@/lib/photo";

describe("Фото профиля", () => {
  it("уменьшает большое фото до 512 px по длинной стороне", () => {
    expect(avatarDimensions(2000, 1000)).toEqual({ width: PHOTO_MAX_SIDE, height: 256 });
  });

  it("не растягивает маленькое фото", () => {
    expect(avatarDimensions(300, 200)).toEqual({ width: 300, height: 200 });
  });

  it("отклоняет файл, который не изображение", () => {
    expect(photoError({ type: "application/pdf", size: 1000 })).toBe(
      "Нужен файл изображения (JPG или PNG).",
    );
  });

  it("отклоняет фото больше 8 МБ", () => {
    expect(photoError({ type: "image/jpeg", size: PHOTO_MAX_BYTES + 1 })).toBe(
      "Фото больше 8 МБ — выберите снимок поменьше.",
    );
  });

  it("принимает обычное фото", () => {
    expect(photoError({ type: "image/jpeg", size: 500_000 })).toBeNull();
  });
});
