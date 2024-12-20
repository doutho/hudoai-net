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
    return "Normal;White;30;None;CeraVe Moisturizing Lotion;CeraVe Hydrating Facial Cleanser;Paula's Choice 2% BHA;La Roche-Posay Anthelios;The Ordinary Retinol 1%";
  }
}