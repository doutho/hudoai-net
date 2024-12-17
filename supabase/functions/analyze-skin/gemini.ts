import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

export async function analyzeSkinImage(base64Image: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || '');
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = `
    As a dermatologist, analyze this skin image and provide:
    1. A brief description of visible skin conditions and concerns (2-3 sentences)
    2. Recommend specific product types needed, focusing on:
       - Cleanser
       - Moisturizer
       - Exfoliant
       - SPF
       - Retinol (if needed)
    
    Format your response as:
    [Skin Analysis]
    
    [Product Recommendations]
    - Cleanser: [type/ingredients needed]
    - Moisturizer: [type/ingredients needed]
    - Exfoliant: [type/ingredients needed]
    - SPF: [type needed]
    - Retinol: [if needed, type/strength]
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
    const text = response.text();
    console.log('Gemini API Response:', text);
    return text;
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}