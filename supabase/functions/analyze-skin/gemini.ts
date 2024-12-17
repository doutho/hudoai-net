import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

export async function analyzeSkinImage(base64Image: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this skin image and provide a detailed analysis in the following format:
    1. A clear, detailed description of the visible skin condition, concerns, and characteristics (2-3 sentences)
    2. List 3 specific skincare product types that would address these concerns, focusing on key ingredients needed
    
    Format your response as plain text. Start with the skin analysis, followed by product suggestions.
    Keep it concise and actionable.
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw error;
  }
}