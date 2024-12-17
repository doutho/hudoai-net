import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const prompts = {
  'en': `Analyze the skin photo and provide a brief, concise overview in one paragraph. Focus on:
1. Main skin concerns and conditions
2. Recommended treatments:
   - Moisturizing needs
   - Cleansing routine
   - Exfoliation if needed
   - Sun protection
   - Retinol if appropriate

Keep it brief and factual. Use ** for emphasis.`,

  'de': `Analysiere das Hautfoto und gib einen kurzen, prägnanten Überblick in einem Absatz. Konzentriere dich auf:
1. Hauptprobleme der Haut
2. Empfohlene Behandlungen:
   - Feuchtigkeitsbedarf
   - Reinigungsroutine
   - Peeling bei Bedarf
   - Sonnenschutz
   - Retinol falls angebracht

Halte es kurz und sachlich. Verwende ** für Betonung.`,

  'sv': `Analysera hudfotot och ge en kort, koncis översikt i ett stycke. Fokusera på:
1. Huvudsakliga hudproblem
2. Rekommenderade behandlingar:
   - Fuktbehov
   - Rengöringsrutin
   - Exfoliering vid behov
   - Solskydd
   - Retinol om lämpligt

Håll det kort och faktabaserat. Använd ** för betoning.`
};

export async function analyzeSkinImage(base64Image: string, language: Language = 'en'): Promise<string> {
  try {
    console.log('Starting Gemini analysis...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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