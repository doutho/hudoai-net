import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const prompts = {
  'en': `Analyze the skin photo and provide a simple, clear analysis:

# Skin Overview
**Current Condition**
Describe the main visible skin characteristics and concerns in simple terms.

# Care Recommendations
**Daily Routine**
List 3-4 key steps for daily skincare.`,

  'de': `Analysieren Sie das Hautfoto und erstellen Sie eine einfache, klare Analyse:

# Hautübersicht
**Aktueller Zustand**
Beschreiben Sie die wichtigsten sichtbaren Hautmerkmale und -probleme in einfachen Worten.

# Pflegeempfehlungen
**Tägliche Routine**
Listen Sie 3-4 wichtige Schritte für die tägliche Hautpflege auf.`,

  'sv': `Analysera hudfotot och ge en enkel, tydlig analys:

# Hudöversikt
**Aktuellt tillstånd**
Beskriv de viktigaste synliga hudegenskaperna och problemen med enkla ord.

# Vårdrekommendationer
**Daglig rutin**
Lista 3-4 viktiga steg för daglig hudvård.`
};

export async function analyzeSkinImage(base64Image: string, language: Language = 'en'): Promise<string> {
  try {
    console.log('Starting Gemini analysis...');
    
    const imageData = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = prompts[language] || prompts['en'];
    
    console.log('Sending request to Gemini with prompt:', prompt);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      }
    ]);

    console.log('Received response from Gemini');
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No analysis text received from Gemini');
    }

    const formattedText = text
      .replace(/^(As an AI language model,|As an AI assistant,)/, '')
      .trim();

    console.log('Formatted analysis text:', formattedText);
    return formattedText;

  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}