import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const prompts = {
  'en': `Analyze the skin photo and provide a comprehensive yet concise analysis in two sections:

1. **Skin Analysis**:
   - Main skin concerns and conditions
   - Current skin state
   - Areas needing attention

2. **Recommended Routine**:
   Provide a brief, step-by-step daily routine explaining when to use:
   - Cleanser (AM/PM)
   - Exfoliant (frequency)
   - Treatment products
   - Moisturizer
   - Sunscreen (AM)
   - Retinol (PM, if appropriate)

Keep the analysis factual and concise. Use ** for emphasis on key points.`,

  'de': `Analysiere das Hautfoto und erstelle eine umfassende, aber prägnante Analyse in zwei Abschnitten:

1. **Hautanalyse**:
   - Hauptprobleme und Hautzustand
   - Aktueller Hautzustand
   - Bereiche, die Aufmerksamkeit benötigen

2. **Empfohlene Routine**:
   Beschreibe eine kurze, schrittweise tägliche Routine mit Erklärungen zur Verwendung von:
   - Reiniger (morgens/abends)
   - Peeling (Häufigkeit)
   - Behandlungsprodukte
   - Feuchtigkeitspflege
   - Sonnenschutz (morgens)
   - Retinol (abends, falls geeignet)

Halte die Analyse sachlich und prägnant. Verwende ** für die Betonung wichtiger Punkte.`,

  'sv': `Analysera hudfotot och ge en omfattande men koncis analys i två sektioner:

1. **Hudanalys**:
   - Huvudsakliga hudproblem och tillstånd
   - Nuvarande hudtillstånd
   - Områden som behöver uppmärksamhet

2. **Rekommenderad Rutin**:
   Ge en kort, steg-för-steg daglig rutin som förklarar när man ska använda:
   - Rengöring (morgon/kväll)
   - Exfoliering (frekvens)
   - Behandlingsprodukter
   - Fuktighetskräm
   - Solskydd (morgon)
   - Retinol (kväll, om lämpligt)

Håll analysen faktabaserad och koncis. Använd ** för betoning av viktiga punkter.`
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