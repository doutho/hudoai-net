import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const basePrompt = `Vänligen svara endast med svaren separerade med kommatecken:
Är personens hud i bilden Oljig, kombinerad, torr eller normal?
Är hudtonen blek vit, vit, olivfärgad, måttligt brun, mörkbrun, svart?
Vad är personens ungefärliga ålder?
Har personen akne? Nej, mild, måttlig, svår.`;

const productPrompts = {
  moisturizer: "Baserat på denna hudanalys, vilken av följande produkter är bäst som fuktighetskräm? Svara endast med produktnamnet exakt som det står: CeraVe Fuktgivande Lotion, La Roche-Posay Effaclar Mat",
  cleanser: "Baserat på denna hudanalys, vilken av följande produkter är bäst som rengöring? Svara endast med produktnamnet exakt som det står: CeraVe Hydrerande Ansiktsrengöring, Cetaphil Gentle Skin Cleanser",
  exfoliant: "Baserat på denna hudanalys, vilken av följande produkter är bäst som exfoliant? Svara endast med produktnamnet exakt som det står: Paula's Choice 2% BHA",
  sunscreen: "Baserat på denna hudanalys, vilken av följande produkter är bäst som solskydd? Svara endast med produktnamnet exakt som det står: La Roche-Posay Anthelios, EVY Technology Solskydd",
  retinol: "Baserat på denna hudanalys, vilken av följande produkter är bäst som retinol? Svara endast med produktnamnet exakt som det står: The Ordinary Retinol 1%"
};

export async function analyzeSkinImage(base64Image: string, language: Language = 'sv'): Promise<string> {
  try {
    console.log('Starting Gemini analysis...');
    
    // Safely handle the base64 string
    let imageData = base64Image;
    if (typeof base64Image === 'string' && base64Image.includes('base64,')) {
      imageData = base64Image.split('base64,')[1];
    }
    
    if (!imageData) {
      throw new Error('Invalid image data format');
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Get base analysis
    const baseResult = await model.generateContent([
      basePrompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      }
    ]);

    const baseAnalysis = baseResult.response.text();
    
    // Get product recommendations
    const recommendations = {};
    for (const [category, prompt] of Object.entries(productPrompts)) {
      const result = await model.generateContent([
        `${baseAnalysis}\n\n${prompt}`,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData
          }
        }
      ]);
      recommendations[category] = result.response.text().trim();
    }

    console.log('Analysis complete:', { baseAnalysis, recommendations });
    return baseAnalysis;

  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}