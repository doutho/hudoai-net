import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const basePrompt = `Please analyze the skin in this image and provide the following information separated by semicolons:
1. Skin type (Oily, Combination, Dry, or Normal)
2. Skin tone (Fair White, White, Olive, Medium Brown, Dark Brown, Black)
3. Approximate age
4. Acne presence (None, Mild, Moderate, Severe)`;

const productPrompt = `Based on this skin analysis, which products would you recommend from the following categories? Respond with product names exactly as listed, separated by semicolons:

Moisturizer: CeraVe Moisturizing Lotion, La Roche-Posay Effaclar Mat
Cleanser: CeraVe Hydrating Facial Cleanser, Cetaphil Gentle Skin Cleanser
Exfoliant: Paula's Choice 2% BHA
Sunscreen: La Roche-Posay Anthelios, EVY Technology Sunscreen
Retinol: The Ordinary Retinol 1%`;

export async function analyzeSkinImage(base64Image: string, language: Language = 'sv'): Promise<string> {
  try {
    console.log('Starting Gemini analysis...');
    
    const imageData = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Get base analysis and product recommendations in one call
    const result = await model.generateContent([
      `${basePrompt}\n\n${productPrompt}`,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      }
    ]);

    const analysisText = result.response.text();
    console.log('Analysis complete:', analysisText);
    
    return analysisText;

  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    // Return default values in case of API failure
    return "Combination;Fair White;30;None;CeraVe Moisturizing Lotion;CeraVe Hydrating Facial Cleanser;Paula's Choice 2% BHA;La Roche-Posay Anthelios;The Ordinary Retinol 1%";
  }
}