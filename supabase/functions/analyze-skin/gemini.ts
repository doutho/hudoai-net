import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

export async function analyzeSkinImage(base64Image: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || '');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    As a dermatologist, analyze this skin image and provide a concise analysis in the following format:

    Brief description of visible skin conditions (2-3 sentences max).

    Based on your skin condition, I recommend:
    - **Cleanser**: [specific type needed] - I recommend the CeraVe Hydrating Facial Cleanser because it's gentle, non-stripping, and contains essential ceramides to maintain skin barrier health
    - **Moisturizer**: [specific type needed] - I recommend the La Roche-Posay Double Repair Face Moisturizer as it provides balanced hydration with ceramides and niacinamide
    - **Exfoliant**: [specific type needed] - I recommend the Paula's Choice 2% BHA Liquid Exfoliant which gently removes dead skin cells and unclogs pores
    - **SPF**: [specific type/strength needed] - I recommend the EltaMD UV Clear Facial Sunscreen SPF 46 because it's lightweight, non-comedogenic, and provides excellent protection
    ${Math.random() > 0.5 ? '- **Retinol**: [specific strength needed] - I recommend The Ordinary Retinol 1% in Squalane as it\'s an effective yet gentle formulation for skin renewal' : ''}

    Please keep the analysis concise and maintain the exact formatting with the bold product categories and specific product recommendations with their benefits.
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