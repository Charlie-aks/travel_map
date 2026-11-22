/**
 * Thiết lập tài khoản demo (chỉ xem) và tài khoản admin thật.
 *
 * Mặc định chạy thử (dry-run), chỉ in ra những gì SẼ thay đổi. Thêm --yes để ghi vào DB.
 * Đọc DATABASE_URL từ .env.local — kiểm tra dòng "DB đích" trước khi thêm --yes.
 *
 *   npx tsx scripts/setup-accounts.ts demo  <email>            # đặt role DEMO cho tài khoản có sẵn
 *   npx tsx scripts/setup-accounts.ts admin <email> [tên]      # nâng lên ADMIN, hoặc tạo mới với mật khẩu ngẫu nhiên
 *   ... --yes                                                   # thực sự ghi
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--yes");
  const [command, email, ...nameParts] = args.filter((a) => a !== "--yes");

  if (!["demo", "admin"].includes(command ?? "") || !email) {
    console.log("Cách dùng:\n  npx tsx scripts/setup-accounts.ts demo <email> [--yes]\n  npx tsx scripts/setup-accounts.ts admin <email> [tên] [--yes]");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("Thiếu DATABASE_URL trong .env.local");
    process.exit(1);
  }

  // In host để người chạy biết đang ghi vào DB nào (không in user/mật khẩu)
  const host = new URL(process.env.DATABASE_URL).host;
  console.log(`DB đích: ${host}`);
  console.log(apply ? "Chế độ: GHI THẬT\n" : "Chế độ: chạy thử (thêm --yes để ghi)\n");

  // Import sau khi đã nạp biến môi trường
  const { db } = await import("../src/db");
  const { users } = await import("../src/db/schema");

  const [existing] = await db
    .select({ id: users.id, name: users.name, role: users.role })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (command === "demo") {
    if (!existing) {
      console.error(`Không tìm thấy tài khoản ${email}. Hãy đăng ký tài khoản này trước.`);
      process.exit(1);
    }
    console.log(`${email}: role ${existing.role ?? "USER"} → DEMO (chỉ xem)`);
    if (apply) await db.update(users).set({ role: "DEMO" }).where(eq(users.id, existing.id));
  } else if (existing) {
    console.log(`${email}: role ${existing.role ?? "USER"} → ADMIN`);
    if (apply) await db.update(users).set({ role: "ADMIN" }).where(eq(users.id, existing.id));
  } else {
    const name = nameParts.join(" ") || "Admin";
    console.log(`Tạo tài khoản ADMIN mới: ${email} (${name})`);
    if (apply) {
      const password = randomBytes(18).toString("base64url");
      await db.insert(users).values({ name, email, role: "ADMIN", password: await bcrypt.hash(password, 10) });
      console.log(`\nMật khẩu (chỉ hiện một lần — lưu vào trình quản lý mật khẩu):\n  ${password}\n`);
    }
  }

  console.log(apply ? "Xong." : "Chưa ghi gì (chạy thử).");
  process.exit(0);
}

main().catch((error) => {
  console.error("Lỗi:", error instanceof Error ? error.message : error);
  process.exit(1);
});
