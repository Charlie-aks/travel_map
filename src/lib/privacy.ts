/** Che email: "nguyenvana@gmail.com" → "n*******a@gmail.com". Dùng khi người xem là tài khoản DEMO công khai. */
export function maskEmail(email: string | null): string | null {
  if (!email) return email;
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at);
  if (local.length <= 2) return `${local[0]}*${domain}`;
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}${domain}`;
}

/** Cột user an toàn để hiển thị công khai (không có password, email). */
export const publicUserColumns = { id: true, name: true, image: true } as const;
