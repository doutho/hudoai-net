import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const prompts = {
  'en': `Analyze the skin photo and provide a comprehensive analysis in two sections:

# Skin Analysis
**Current Condition**
Describe the main skin concerns and overall skin health.

**Areas of Focus**
List specific areas needing attention.

# Recommended Care
**Daily Routine**
List the recommended morning and evening skincare steps.

**Special Treatments**
List any specific treatments or products needed.

Keep the analysis factual and concise. Use ** ** for subtitles and important points.`,

  'de': `Analysieren Sie das Hautfoto und erstellen Sie eine umfassende Analyse in zwei Abschnitten:

# Hautanalyse
**Aktueller Zustand**
Beschreiben Sie die wichtigsten Hautprobleme und die allgemeine Hautgesundheit.

**Fokus Bereiche**
Listen Sie spezifische Bereiche auf die Aufmerksamkeit benotigen.

# Empfohlene Pflege
**Tagliche Routine**
Listen Sie die empfohlenen Morgen und Abend Hautpflegeschritte auf.

**Spezielle Behandlungen**
Listen Sie spezifische Behandlungen oder Produkte auf die benotigt werden.

Halten Sie die Analyse sachlich und prazise. Verwenden Sie ** ** fur Untertitel und wichtige Punkte.`,

  'sv': `Analysera hudfotot och ge en omfattande analys i två sektioner:

# Hudanalys
**Aktuellt tillstånd**
Beskriv de huvudsakliga hudproblemen och den allmänna hudhälsan.

**Fokusområden**
Lista specifika områden som behöver uppmärksamhet.

# Rekommenderad vård
**Daglig rutin**
Lista rekommenderade morgon och kvällsrutiner för hudvård.

**Särskilda behandlingar**
Lista specifika behandlingar eller produkter som behövs.

Håll analysen saklig och koncis. Använd ** ** för underrubriker och viktiga punkter.`
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