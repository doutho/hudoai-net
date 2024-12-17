import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const prompts = {
  'en': `Analyze the skin photo and provide a comprehensive yet concise analysis in three sections:

1. **Skin Analysis**:
   - Main skin concerns and conditions
   - Current skin state
   - Areas needing attention

2. **Recommended Routine**:
   Provide a clear, step-by-step daily routine explaining:
   - Morning routine (AM):
     * Cleanser
     * Treatment products (if needed)
     * Moisturizer
     * Sunscreen
   - Evening routine (PM):
     * Cleanser
     * Exfoliant (specify frequency)
     * Treatment products
     * Moisturizer
     * Retinol (if appropriate)

3. **Product Usage Tips**:
   - How to layer products correctly
   - Frequency of use for active ingredients
   - Any specific application techniques

Keep the analysis factual and concise. Use ** for emphasis on key points.`,

  'de': `Analysiere das Hautfoto und erstelle eine umfassende, aber prägnante Analyse in drei Abschnitten:

1. **Hautanalyse**:
   - Hauptprobleme und Hautzustand
   - Aktueller Hautzustand
   - Bereiche, die Aufmerksamkeit benötigen

2. **Empfohlene Routine**:
   Beschreibe eine klare, schrittweise tägliche Routine:
   - Morgenroutine (AM):
     * Reiniger
     * Behandlungsprodukte (falls nötig)
     * Feuchtigkeitspflege
     * Sonnenschutz
   - Abendroutine (PM):
     * Reiniger
     * Peeling (Häufigkeit angeben)
     * Behandlungsprodukte
     * Feuchtigkeitspflege
     * Retinol (falls geeignet)

3. **Anwendungstipps**:
   - Wie die Produkte richtig geschichtet werden
   - Anwendungshäufigkeit aktiver Inhaltsstoffe
   - Spezielle Anwendungstechniken

Halte die Analyse sachlich und prägnant. Verwende ** für die Betonung wichtiger Punkte.`,

  'sv': `Analysera hudfotot och ge en omfattande men koncis analys i tre sektioner:

1. **Hudanalys**:
   - Huvudsakliga hudproblem och tillstånd
   - Nuvarande hudtillstånd
   - Områden som behöver uppmärksamhet

2. **Rekommenderad Rutin**:
   Ge en tydlig, steg-för-steg daglig rutin:
   - Morgonrutin (AM):
     * Rengöring
     * Behandlingsprodukter (vid behov)
     * Fuktighetskräm
     * Solskydd
   - Kvällsrutin (PM):
     * Rengöring
     * Exfoliering (ange frekvens)
     * Behandlingsprodukter
     * Fuktighetskräm
     * Retinol (om lämpligt)

3. **Användningstips**:
   - Hur produkterna ska läggas i rätt ordning
   - Användningsfrekvens för aktiva ingredienser
   - Särskilda appliceringsmetoder

Håll analysen faktabaserad och koncis. Använd ** för betoning av viktiga punkter.`
};

export async function analyzeSkinImage(base64Image: string, language: Language = 'en'): Promise<string> {
  try {
    console.log('Starting Gemini analysis...');
    
    // Remove data URL prefix if present
    const imageData = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
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