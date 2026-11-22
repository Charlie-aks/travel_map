import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireWriter } from '@/lib/auth-guard';
import { handleRouteError } from '@/lib/route-error';

export const maxDuration = 30; // Vercel max duration limit if applicable

const MAX_BODY_BYTES = 200_000;    // chặn sớm body quá lớn
const HISTORY_WINDOW = 12;         // chỉ gửi N tin gần nhất lên model (không từ chối hội thoại dài)
const MAX_USER_TEXT = 1000;        // ký tự mỗi tin nhắn người dùng (khớp maxLength ở client)
const MAX_ASSISTANT_TEXT = 3000;   // tin trả lời cũ của model gửi lại làm ngữ cảnh — cắt bớt nếu dài
const MAX_OUTPUT_TOKENS = 800;

// Nhận shape lỏng để không vỡ khi AI SDK thêm part phụ (vd. "step-start"), nhưng khi dựng lại
// message CHỈ giữ part text. Part file/reasoning/tool… bị bỏ: chúng cho phép đẩy URL/PDF/video
// hoặc nội dung rất lớn lên Gemini mà không bị đếm vào giới hạn.
const incomingMessage = z.object({
  id: z.string().max(100),
  role: z.enum(['user', 'assistant']), // không nhận 'system' từ client
  parts: z.array(z.looseObject({ type: z.string(), text: z.unknown().optional() })).max(50),
});
const bodySchema = z.object({ messages: z.array(incomingMessage).min(1).max(200) });

function textOf(parts: { type: string; text?: unknown }[]): string {
  return parts
    .filter((p) => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text as string)
    .join('');
}

export async function POST(req: Request) {
  try {
    // Mỗi request tốn quota Gemini → bắt buộc đăng nhập, và chặn tài khoản DEMO
    // (mật khẩu DEMO công khai, chưa có rate limit — xem ROADMAP giai đoạn 1).
    await requireWriter();

    if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
      return Response.json({ error: 'Request too large', code: 'INVALID_INPUT' }, { status: 413 });
    }

    const { messages: incoming } = bodySchema.parse(await req.json());
    const recent = incoming.slice(-HISTORY_WINDOW);

    const last = recent[recent.length - 1];
    if (last.role !== 'user') {
      return Response.json({ error: 'Last message must be from user', code: 'INVALID_INPUT' }, { status: 400 });
    }

    // Dựng lại message từ dữ liệu đã kiểm tra — không chuyển tiếp object gốc của client
    const messages: UIMessage[] = [];
    for (const m of recent) {
      let text = textOf(m.parts).trim();
      if (m.role === 'user' && text.length > MAX_USER_TEXT) {
        return Response.json({ error: 'Message too long', code: 'INVALID_INPUT' }, { status: 400 });
      }
      if (m.role === 'assistant') text = text.slice(0, MAX_ASSISTANT_TEXT);
      if (!text) continue;
      messages.push({ id: m.id, role: m.role, parts: [{ type: 'text', text }] });
    }

    // Lấy thông tin các địa điểm đã được duyệt để cung cấp làm bối cảnh (context/RAG) cho AI
    const approvedLocations = await db
      .select({
        title: locations.title,
        description: locations.description,
        category: locations.category,
      })
      .from(locations)
      .where(eq(locations.status, 'APPROVED'));

    const locationsContext = approvedLocations.map((loc) =>
      `- ${loc.title} (${loc.category}): ${loc.description?.substring(0, 50)}...`
    ).join('\n');

    const systemPrompt = `
Bạn là AI Travel Concierge (Trợ lý ảo du lịch) của "The Coastal Edit: Phan Thiet Travel Map".
Nhiệm vụ của bạn là hỗ trợ, tư vấn, và giúp người dùng khám phá, lên lịch trình du lịch tại Phan Thiết một cách chuyên nghiệp, nhiệt tình và thân thiện.
Bạn biết về các địa điểm có thật trên hệ thống (danh sách bên dưới). Nếu người dùng hỏi, hãy ưu tiên gợi ý từ danh sách này.

Danh sách các địa điểm có trên nền tảng:
${locationsContext}

Nguyên tắc:
1. Trả lời bằng tiếng Việt, thân thiện nhưng chuyên nghiệp. Dùng Emoji để tăng sự sinh động.
2. Với các câu hỏi không liên quan đến du lịch Phan Thiết, hãy từ chối nhẹ nhàng và hướng họ quay lại chủ đề chính.
3. Nếu không biết thông tin, hãy thành thật đáp là chưa có thông tin nhưng có thể khám phá thêm trên bản đồ.
4. Trả lời ngắn ngọn, súc tích, format rõ ràng (dùng bullet points, in đậm tên địa điểm).
`;

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return handleRouteError(error, 'POST /api/chat');
  }
}
