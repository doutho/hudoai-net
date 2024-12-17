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
Describe the main visible skin characteristics in detail, including:
- Main skin concerns and their location
- Skin texture and tone
- Any visible inflammation or discoloration
- Overall skin hydration level

# Care Recommendations
**Daily Routine**
Morning:
1. Cleanser: How to use and what type
2. Treatment: Any specific morning treatments
3. Moisturizer: Type and application method
4. Sunscreen: SPF recommendation and importance

Evening:
1. Cleanser: Double cleansing if needed
2. Treatment: Specific evening products
3. Moisturizer: Night cream recommendations`,

  'de': `Analysieren Sie das Hautfoto und erstellen Sie eine einfache, klare Analyse:

# Hautübersicht
**Aktueller Zustand**
Beschreiben Sie die wichtigsten sichtbaren Hautmerkmale im Detail:
- Haupthautprobleme und ihre Position
- Hautstruktur und -ton
- Sichtbare Entzündungen oder Verfärbungen
- Allgemeiner Feuchtigkeitsgehalt der Haut

# Pflegeempfehlungen
**Tägliche Routine**
Morgens:
1. Reinigung: Anwendung und Produkttyp
2. Behandlung: Spezielle Morgenprodukte
3. Feuchtigkeitspflege: Art und Anwendung
4. Sonnenschutz: SPF-Empfehlung und Wichtigkeit

Abends:
1. Reinigung: Bei Bedarf Doppelreinigung
2. Behandlung: Spezielle Abendprodukte
3. Feuchtigkeitspflege: Nachtcreme-Empfehlungen`,

  'sv': `Analysera hudfotot och ge en enkel, tydlig analys:

# Hudöversikt
**Aktuellt tillstånd**
Beskriv de viktigaste synliga hudegenskaperna i detalj:
- Huvudsakliga hudproblem och deras placering
- Hudstruktur och hudton
- Synlig inflammation eller missfärgning
- Övergripande fuktnivå i huden

# Vårdrekommendationer
**Daglig rutin**
Morgon:
1. Rengöring: Hur man använder och vilken typ
2. Behandling: Specifika morgonprodukter
3. Fuktkräm: Typ och appliceringsmetod
4. Solskydd: SPF-rekommendation och betydelse

Kväll:
1. Rengöring: Dubbelrengöring vid behov
2. Behandling: Specifika kvällsprodukter
3. Fuktkräm: Nattkrämsrekommendationer`
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

    // Ensure proper encoding of Swedish characters
    const formattedText = text
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
      .trim();

    console.log('Formatted analysis text:', formattedText);
    return formattedText;

  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}