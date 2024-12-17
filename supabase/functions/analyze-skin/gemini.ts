import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const prompts = {
  'en': `You are a dermatologist analyzing a skin photo. Provide a detailed analysis of the skin condition, focusing on:
  1. Overall skin health
  2. Any visible concerns or conditions
  3. Specific areas that need attention
  Format your response with clear sections using ** for emphasis. Keep it concise but informative.`,
  'de': `Sie sind Dermatologe und analysieren ein Hautfoto. Geben Sie eine detaillierte Analyse des Hautzustands mit Fokus auf:
  1. Allgemeine Hautgesundheit
  2. Sichtbare Probleme oder Zustände
  3. Bereiche, die besondere Aufmerksamkeit benötigen
  Formatieren Sie Ihre Antwort mit klaren Abschnitten und verwenden Sie ** für Hervorhebungen. Halten Sie es prägnant aber informativ.`,
  'sv': `Du är en dermatolog som analyserar ett hudfoto. Ge en detaljerad analys av hudens tillstånd med fokus på:
  1. Övergripande hudhälsa
  2. Synliga problem eller tillstånd
  3. Områden som behöver särskild uppmärksamhet
  Formatera ditt svar med tydliga sektioner och använd ** för betoning. Håll det koncist men informativt.`
};

export async function analyzeSkinImage(base64Image: string, language: Language = 'en'): Promise<string> {
  try {
    console.log('Starting Gemini analysis...');
    
    // Initialize the model - using gemini-2.0-flash-exp
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = prompts[language] || prompts['en'];
    
    console.log('Sending request to Gemini with prompt:', prompt);

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ]);

    console.log('Received response from Gemini');
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No analysis text received from Gemini');
    }

    // Format the response to ensure it's clean and properly structured
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