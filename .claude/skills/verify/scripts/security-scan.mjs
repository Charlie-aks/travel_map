#!/usr/bin/env node
/**
 * security-scan.mjs — quét tĩnh các lỗi bảo mật hay gặp trong project này.
 *
 * Đây là heuristic (dựa trên regex), KHÔNG thay thế review thủ công:
 * - Có thể báo nhầm (false positive) → đọc code rồi mới kết luận.
 * - Có thể bỏ sót → vẫn phải đọc lại logic phân quyền.
 *
 * Cách dùng (chạy từ thư mục gốc repo):
 *   node .claude/skills/verify/scripts/security-scan.mjs              # quét toàn bộ src/
 *   node .claude/skills/verify/scripts/security-scan.mjs <file> ...   # chỉ báo cáo cho các file này
 *   node .claude/skills/verify/scripts/security-scan.mjs --json       # xuất JSON
 *
 * Exit code: 1 nếu có phát hiện mức HIGH trong phạm vi quét, ngược lại 0.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const onlyFiles = args
  .filter((a) => !a.startsWith("--"))
  .map((f) => toPosix(relative(ROOT, resolve(ROOT, f))));

// Route công khai có chủ đích — không bắt buộc đăng nhập cho handler ghi dữ liệu.
const PUBLIC_MUTATION_ROUTES = new Set([
  "src/app/api/auth/[...nextauth]/route.ts",
  "src/app/api/auth/register/route.ts",
]);

// Các lời gọi được coi là "có kiểm tra đăng nhập/quyền".
// Helper trong src/lib/auth-guard.ts: requireUser, requireWriter, requireAdmin, requireAdminViewer.
const AUTH_CALL = /\b(auth|requireUser|requireWriter|requireAdmin|requireAdminViewer)\s*\(/;
// Dấu hiệu đã thực sự CHẶN request khi không đủ quyền (không chỉ gọi auth()).
const AUTH_ENFORCED = /\b(requireUser|requireWriter|requireAdmin|requireAdminViewer)\s*\(|if\s*\(\s*!\s*session\b|session\?\.user\?\.(id|role)\s*!==?|!\s*session\?\.user/;
const ADMIN_CHECK = /\b(requireAdmin|requireAdminViewer)\s*\(|role\s*[!=]==?\s*["']ADMIN["']|["']ADMIN["']\s*[!=]==?\s*\S*role/;

function toPosix(p) {
  return p.split(sep).join("/");
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|mjs)$/.test(name)) out.push(full);
  }
  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

/** Lấy nội dung trong cặp ngoặc bắt đầu tại openIdx (vị trí ký tự mở). */
function balanced(text, openIdx) {
  const open = text[openIdx];
  const close = { "(": ")", "{": "}", "[": "]" }[open];
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    if (text[i] === open) depth++;
    else if (text[i] === close) {
      depth--;
      if (depth === 0) return text.slice(openIdx, i + 1);
    }
  }
  return text.slice(openIdx);
}

/** Tách các hàm export (async function NAME / const NAME = async) cùng phần thân. */
function exportedFunctions(text) {
  const re = /export\s+(?:async\s+)?function\s+(\w+)\s*\(|export\s+const\s+(\w+)\s*=\s*async\b/g;
  const found = [];
  let m;
  while ((m = re.exec(text))) found.push({ name: m[1] || m[2], index: m.index });
  return found.map((f, i) => ({
    ...f,
    body: text.slice(f.index, i + 1 < found.length ? found[i + 1].index : text.length),
  }));
}

const findings = [];
const seen = new Set();
function add(severity, file, line, rule, message) {
  const key = `${file}:${line}:${rule}`;
  if (seen.has(key)) return;
  seen.add(key);
  findings.push({ severity, file, line, rule, message });
}

const files = walk(SRC).map((f) => ({ abs: f, rel: toPosix(relative(ROOT, f)) }));

for (const { abs, rel } of files) {
  const text = readFileSync(abs, "utf8");
  const isApiRoute = /^src\/app\/api\/.+\/route\.(ts|js)$/.test(rel);
  const isServerActionFile = /^\s*["']use server["']/.test(text);

  // 1) API route: handler ghi dữ liệu phải có kiểm tra đăng nhập; /api/admin/* phải kiểm tra ADMIN.
  if (isApiRoute) {
    for (const fn of exportedFunctions(text)) {
      if (!/^(GET|POST|PUT|PATCH|DELETE)$/.test(fn.name)) continue;
      const line = lineOf(text, fn.index);
      const mutating = fn.name !== "GET";
      if (mutating && !PUBLIC_MUTATION_ROUTES.has(rel)) {
        if (!AUTH_CALL.test(fn.body)) {
          add("HIGH", rel, line, "route-missing-auth", `${fn.name} ghi dữ liệu nhưng không gọi auth()/requireUser()/requireAdmin().`);
        } else if (!AUTH_ENFORCED.test(fn.body)) {
          add("HIGH", rel, line, "route-auth-not-enforced",
            `${fn.name} có gọi auth() nhưng không chặn khi chưa đăng nhập (vd. dùng session?.user?.id || null).`);
        }
      }
      if (rel.startsWith("src/app/api/admin/") && !ADMIN_CHECK.test(fn.body)) {
        add("HIGH", rel, line, "admin-route-missing-role-check", `${fn.name} trong /api/admin không kiểm tra quyền ADMIN.`);
      }
    }
  }

  // 2) Server action: mỗi hàm export phải tự kiểm tra quyền (layout/page redirect KHÔNG bảo vệ action).
  if (isServerActionFile) {
    for (const fn of exportedFunctions(text)) {
      if (!AUTH_CALL.test(fn.body)) {
        add("HIGH", rel, lineOf(text, fn.index), "server-action-missing-auth",
          `Server action "${fn.name}" không kiểm tra đăng nhập/quyền — có thể bị gọi trực tiếp qua POST.`);
      }
    }
  }

  // 3) Lộ cột nhạy cảm của bảng user (password, email...).
  if (rel !== "src/auth.ts") {
    for (const m of text.matchAll(/\b(author|reporter|user)\s*:\s*true\b/g)) {
      add("HIGH", rel, lineOf(text, m.index), "relation-loads-full-user",
        `"${m[1]}: true" nạp toàn bộ cột user (gồm password hash). Dùng { columns: { id: true, name: true, image: true } }.`);
    }
    for (const m of text.matchAll(/db\.query\.users\.find(Many|First)\s*\(/g)) {
      const call = balanced(text, m.index + m[0].length - 1);
      if (!/\bcolumns\s*:/.test(call)) {
        add("HIGH", rel, lineOf(text, m.index), "users-query-no-columns",
          "db.query.users.find* không giới hạn columns → trả cả password hash.");
      }
    }
    for (const m of text.matchAll(/\.select\(\s*\)\s*\.from\(\s*users\s*\)/g)) {
      add("MEDIUM", rel, lineOf(text, m.index), "select-all-users",
        "select() * from users — chắc chắn không trả kết quả này ra client?");
    }
  }

  // 4) Lộ chi tiết lỗi nội bộ ra response.
  if (isApiRoute || isServerActionFile) {
    for (const m of text.matchAll(/\bstack\s*:|details\s*:\s*\w+\.message|JSON\.stringify\(\s*\{\s*error\s*:\s*String\(/g)) {
      add("MEDIUM", rel, lineOf(text, m.index), "leaks-error-details",
        "Trả stack trace / error.message ra client. Chỉ log ở server, trả thông báo chung.");
    }
    for (const m of text.matchAll(/console\.log\([^)]*\b(body|password|token)\b/gi)) {
      add("MEDIUM", rel, lineOf(text, m.index), "logs-sensitive-input",
        "Log nguyên request body / dữ liệu nhạy cảm.");
    }
  }

  // 5) Upload: phải giới hạn loại và kích thước file.
  if (isApiRoute && rel.includes("/upload/")) {
    if (!/\.size\b/.test(text)) add("HIGH", rel, 1, "upload-no-size-limit", "Upload không kiểm tra kích thước file.");
    if (!/\.type\b/.test(text)) add("HIGH", rel, 1, "upload-no-type-check", "Upload không kiểm tra loại file (MIME).");
    if (/file\.name/.test(text) && /writeFile/.test(text)) {
      add("HIGH", rel, lineOf(text, text.indexOf("file.name")), "upload-user-filename",
        "Dùng tên file do người dùng gửi khi ghi đĩa → nguy cơ path traversal. Tự sinh tên (randomUUID + ext đã kiểm tra).");
    }
  }

  // 6) Cấu hình auth / credential cứng.
  if (rel === "src/auth.ts" && /debug\s*:\s*true/.test(text)) {
    add("MEDIUM", rel, lineOf(text, text.search(/debug\s*:\s*true/)), "auth-debug-on",
      "NextAuth debug: true — chỉ bật khi NODE_ENV === 'development'.");
  }
  for (const m of text.matchAll(/admin@gmail\.com|useState\(\s*['"]1234['"]\s*\)/g)) {
    add("HIGH", rel, lineOf(text, m.index), "hardcoded-credentials", "Thông tin đăng nhập admin bị hardcode trong mã nguồn.");
  }
}

// Lọc theo danh sách file nếu có truyền vào.
const scoped = onlyFiles.length ? findings.filter((f) => onlyFiles.includes(f.file)) : findings;
const order = { HIGH: 0, MEDIUM: 1 };
scoped.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line);

if (asJson) {
  console.log(JSON.stringify(scoped, null, 2));
} else if (scoped.length === 0) {
  console.log(`security-scan: không phát hiện vấn đề (${onlyFiles.length ? onlyFiles.length + " file" : "toàn bộ src/"}).`);
} else {
  const high = scoped.filter((f) => f.severity === "HIGH").length;
  console.log(`security-scan: ${scoped.length} phát hiện (${high} HIGH, ${scoped.length - high} MEDIUM)\n`);
  for (const f of scoped) console.log(`[${f.severity}] ${f.file}:${f.line}  (${f.rule})\n         ${f.message}`);
}
process.exit(scoped.some((f) => f.severity === "HIGH") ? 1 : 0);
