
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "./constants.ts";

// Initialize with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendation = async (userInput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User asks: ${userInput}. Based on our products: ${JSON.stringify(PRODUCTS)}, suggest the best option and explain why. Keep it discreet, professional, and helpful.`,
      config: {
        systemInstruction: "Bạn là chuyên gia tư vấn sức khỏe tại hệ thống THE SHIELD POINT. Hãy trả lời thân thiện, bảo mật và chuyên nghiệp bằng tiếng Việt. Tập trung vào việc giải thích ưu điểm của từng loại sản phẩm phù hợp với nhu cầu người dùng.",
      },
    });
    // Use .text property to get the generated text
    return response.text || "Xin lỗi, tôi không tìm thấy thông tin phù hợp.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Xin lỗi, tôi đang gặp chút trục trặc. Bạn có thể tham khảo danh sách sản phẩm bên dưới nhé!";
  }
};
