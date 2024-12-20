import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";
import { geminiPrompts } from "./prompts.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function analyzeSkinImage(base64Image: string, language: Language = 'sv'): Promise<string> {
  try {
    console.log('Starting Gemini analysis...');
    
    const imageData = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      geminiPrompts[language],
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
    return "Normal;White;30;None;CeraVe Moisturizing Lotion;Perfect for your normal skin type, apply a small amount morning and night after cleansing;CeraVe Hydrating Facial Cleanser;Gentle cleanser suitable for daily use, massage onto damp skin morning and evening;Paula's Choice 2% BHA;Use 2-3 times per week in the evening after cleansing;La Roche-Posay Anthelios;Apply generously 15 minutes before sun exposure, reapply every 2 hours;The Ordinary Retinol 1%;Start using twice a week in the evening, gradually increase frequency as tolerated";
  }
}