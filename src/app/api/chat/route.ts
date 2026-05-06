import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const maxDuration = 30; // Vercel max duration limit if applicable

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("API Body:", JSON.stringify(body));
    const { messages } = body;

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

    // Gọi Gemini Pro (streamText)
    const result = await streamText({
      model: google('gemini-2.5-flash'), // Use a supported available model
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      // Trong tương lai, cấu hình tools ở đây để AI thực hiện hành động tự động thêm địa điểm.
      /*
      tools: {
        saveLocation: tool({
          description: 'Save a location to user collection',
          parameters: z.object({ locationId: z.string() }),
          execute: async ({ locationId }) => { ... },
        })
      }
      */
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: String(error), stack: error instanceof Error ? error.stack : undefined }), { status: 500, headers: {'Content-Type': 'application/json'} });
  }
}
