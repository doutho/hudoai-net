import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const prompts = {
  'en': `You are a friendly skincare advisor analyzing a skin photo. Provide a concise analysis focusing on:

1. Overall skin health and main concerns
2. Product recommendations for:
   - One moisturizer (mention [MOISTURIZER])
   - One cleanser (mention [CLEANSER])
   - One exfoliant if needed (mention [EXFOLIANT])
   - One sunscreen (mention [SUNSCREEN])
   - One retinol if needed (mention [RETINOL])

Keep it friendly and casual, like chatting with a friend. Format with ** for emphasis. 
Integrate product recommendations naturally into the analysis, using [PRODUCT] placeholders.
Don't be too serious or medical - keep it light and supportive.`,

  'de': `Du bist ein freundlicher Hautpflege-Berater, der ein Hautfoto analysiert. Gib eine kurze Analyse mit Fokus auf:

1. Allgemeine Hautgesundheit und Hauptanliegen
2. Produktempfehlungen für:
   - Eine Feuchtigkeitscreme (erwähne [MOISTURIZER])
   - Ein Reinigungsmittel (erwähne [CLEANSER])
   - Ein Peeling bei Bedarf (erwähne [EXFOLIANT])
   - Einen Sonnenschutz (erwähne [SUNSCREEN])
   - Ein Retinol bei Bedarf (erwähne [RETINOL])

Bleib freundlich und locker, wie ein Gespräch unter Freunden. Formatiere mit ** für Betonung.
Integriere Produktempfehlungen natürlich in die Analyse mit [PRODUCT] Platzhaltern.
Nicht zu ernst oder medizinisch - halte es leicht und unterstützend.`,

  'sv': `Du är en vänlig hudvårdsrådgivare som analyserar ett hudfoto. Ge en kortfattad analys med fokus på:

1. Övergripande hudhälsa och huvudproblem
2. Produktrekommendationer för:
   - En fuktighetskräm (nämn [MOISTURIZER])
   - Ett rengöringsmedel (nämn [CLEANSER])
   - En exfoliant vid behov (nämn [EXFOLIANT])
   - Ett solskydd (nämn [SUNSCREEN])
   - En retinol vid behov (nämn [RETINOL])

Håll det vänligt och avslappnat, som att prata med en vän. Formatera med ** för betoning.
Integrera produktrekommendationer naturligt i analysen med [PRODUCT] platshållare.
Inte för allvarligt eller medicinskt - håll det lätt och stödjande.`
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