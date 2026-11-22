/**
 * Che email cho người xem là tài khoản DEMO công khai: "nguyenvana@congty.vn" → "***@***.vn".
 * Che cả phần local lẫn tên miền (tên miền riêng như công ty cũng là thông tin nhận diện);
 * chỉ giữ đuôi TLD để giao diện vẫn trông giống một địa chỉ email.
 */
export function maskEmail(email: string | null): string | null {
  if (!email) return email;
  const at = email.lastIndexOf("@");
  if (at <= 0) return "***";
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  const tld = dot >= 0 ? domain.slice(dot) : "";
  return `***@***${tld}`;
}

/** Cột user an toàn để hiển thị công khai (không có password, email). */
export const publicUserColumns = { id: true, name: true, image: true } as const;
