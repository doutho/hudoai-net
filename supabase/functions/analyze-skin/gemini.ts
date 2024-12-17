import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

export async function analyzeSkinImage(base64Image: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || '');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    As a dermatologist, analyze this skin image and provide a concise analysis in the following format:

    [Skin Analysis]
    Brief description of visible skin conditions (2-3 sentences max).

    Based on your skin condition, I recommend:
    - **Cleanser**: [specific type needed]
    - **Moisturizer**: [specific type needed]
    - **Exfoliant**: [specific type needed]
    - **SPF**: [specific type/strength needed]
    ${Math.random() > 0.5 ? '- **Retinol**: [specific strength needed]' : ''}

    Please keep the analysis concise and maintain the exact formatting with the bold product categories.
  `;

  try {
    console.log('Calling Gemini API with image...');
    
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
    const text = response.text();
    console.log('Gemini API Response:', text);
    return text;
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}