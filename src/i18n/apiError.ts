import { useI18nStore } from "@/store/useI18nStore";
import { en } from "./locales/en";
import { vi } from "./locales/vi";

/**
 * Thông báo lỗi theo ngôn ngữ hiện tại, dựa trên `code` mà API trả về ({ error, code }).
 * Dùng được ngoài React component (vd. trong action của Zustand store).
 */
export function apiErrorMessage(code?: string): string {
  const t = useI18nStore.getState().language === "en" ? en : vi;
  switch (code) {
    case "UNAUTHORIZED":
      return t.apiErrors.unauthorized;
    case "FORBIDDEN":
      return t.apiErrors.forbidden;
    case "DEMO_READ_ONLY":
      return t.apiErrors.demoReadOnly;
    case "INVALID_INPUT":
      return t.apiErrors.invalidInput;
    case "NOT_FOUND":
      return t.apiErrors.notFound;
    default:
      return t.apiErrors.generic;
  }
}

/** Đọc body lỗi của response và trả thông báo đã dịch. */
export async function readApiError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { code?: string };
    return apiErrorMessage(data.code ?? (res.status === 401 ? "UNAUTHORIZED" : undefined));
  } catch {
    return apiErrorMessage(res.status === 401 ? "UNAUTHORIZED" : undefined);
  }
}
