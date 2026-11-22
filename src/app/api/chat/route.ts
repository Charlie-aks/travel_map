import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireUser } from '@/lib/auth-guard';
import { handleRouteError } from '@/lib/route-error';

export const maxDuration = 30; // Vercel max duration limit if applicable

const MAX_MESSAGES = 30;          // độ dài hội thoại tối đa gửi lên model
const MAX_USER_TEXT = 1000;       // ký tự mỗi tin nhắn của người dùng
const MAX_ASSISTANT_TEXT = 8000;  // tin trả lời cũ của model được gửi lại làm ngữ cảnh

const textPart = z.object({ type: z.literal('text'), text: z.string() });

// Chỉ nhận role user/assistant: client không được tự chèn system prompt.
const messageSchema = z.looseObject({
  id: z.string().max(100),
  role: z.enum(['user', 'assistant']),
  parts: z.array(z.looseObject({ type: z.string() })).max(50),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
});

function totalText(parts: { type: string }[]): number {
  return parts.reduce((sum, p) => {
    const parsed = textPart.safeParse(p);
    return sum + (parsed.success ? parsed.data.text.length : 0);
  }, 0);
}

export async function POST(req: Request) {
  try {
    // Chatbot gọi Gemini — mỗi request tốn quota, nên bắt buộc đăng nhập (tài khoản DEMO vẫn dùng được).
    await requireUser();

    const { messages } = bodySchema.parse(await req.json());
    for (const m of messages) {
      const limit = m.role === 'user' ? MAX_USER_TEXT : MAX_ASSISTANT_TEXT;
      if (totalText(m.parts) > limit) {
        return Response.json({ error: 'Message too long', code: 'INVALID_INPUT' }, { status: 400 });
      }
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
      messages: await convertToModelMessages(messages as unknown as UIMessage[]),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return handleRouteError(error, 'POST /api/chat');
  }
}
