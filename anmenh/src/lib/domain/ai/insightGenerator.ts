export interface DailyInsightResponse {
  energyScore: number;
  doList: string[];
  avoidList: string[];
  luckyColor: string;
}

/**
 * Gọi Xuyên API OpenAI tạo Insight dựa trên Hồ sơ Bát Tự + Ngày Hiện Tại
 * (Không dùng SDK để tránh dependency rác, chỉ dùng fetch gốc - Edge friendly)
 */
export async function generateDailyInsight(
  element: string,
  zodiac: string,
  targetDate: string
): Promise<DailyInsightResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ Không tìm thấy OPENAI_API_KEY, trả về dữ liệu Mock Insight");
    return {
      energyScore: 75,
      doList: ["Ăn sáng đầy đủ", "Mở lòng với người mới"],
      avoidList: ["Cãi nhau với khách hàng", "Đầu tư rủi ro lớn hôm nay"],
      luckyColor: "Vàng cát",
    };
  }

  const prompt = `
Bạn là một AI Tử vi siêu việt, phân tích cho một người mệnh: ${element}, tuổi: ${zodiac}.
Ngày xem tương lai: ${targetDate}.
Giọng văn: GenZ, Straight-talk, đi thẳng vào vấn đề, không màu mè sáo rỗng.
Trả về đúng định dạng JSON chuẩn (không markdown code block) theo schema sau:
{
  "energyScore": number (0-100),
  "doList": string[] (2-3 việc nên làm),
  "avoidList": string[] (2-3 việc tuyệt đối tránh),
  "luckyColor": string (Màu may mắn, ví dụ: "Xanh nõn chuối")
}
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Dùng bản mini cho siêu tốc/rẻ
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);
    return result as DailyInsightResponse;
    
  } catch (error) {
    console.error("AI Generation Error", error);
    return null;
  }
}
