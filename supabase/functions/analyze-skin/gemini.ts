import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.1";
import type { Language } from "./types.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const prompts = {
  'en': `Analyze the skin photo and provide a comprehensive analysis in two sections:

1. **Skin Analysis**
Provide a detailed but concise analysis of the skin's current condition, including:
- Main skin concerns and conditions
- Current skin state
- Areas needing attention
- Overall skin health assessment

2. **Recommended Routine**
Describe a complete daily skincare routine, including:
- Morning routine steps with specific product types
- Evening routine steps with specific product types
- How often to use specific treatments
- Important tips for product application

Keep the analysis factual and concise. Use ** for emphasis on key points.`,

  'de': `Analysieren Sie das Hautfoto und erstellen Sie eine umfassende Analyse in zwei Abschnitten:

1. **Hautanalyse**
Erstellen Sie eine detaillierte, aber präzise Analyse des aktuellen Hautzustands, einschließlich:
- Haupthautprobleme und -zustände
- Aktueller Hautzustand
- Bereiche, die Aufmerksamkeit benötigen
- Allgemeine Beurteilung der Hautgesundheit

2. **Empfohlene Routine**
Beschreiben Sie eine vollständige tägliche Hautpflegeroutine, einschließlich:
- Schritte der Morgenroutine mit spezifischen Produkttypen
- Schritte der Abendroutine mit spezifischen Produkttypen
- Wie oft bestimmte Behandlungen anzuwenden sind
- Wichtige Tipps zur Produktanwendung

Halten Sie die Analyse sachlich und präzise. Verwenden Sie ** für die Betonung wichtiger Punkte.`,

  'sv': `Analysera hudfotot och ge en omfattande analys i två sektioner:

1. **Hudanalys**
Ge en detaljerad men koncis analys av hudens nuvarande tillstånd, inklusive:
- Huvudsakliga hudproblem och tillstånd
- Nuvarande hudtillstånd
- Områden som behöver uppmärksamhet
- Övergripande bedömning av hudhälsan

2. **Rekommenderad Rutin**
Beskriv en komplett daglig hudvårdsrutin, inklusive:
- Morgonrutinens steg med specifika produkttyper
- Kvällsrutinens steg med specifika produkttyper
- Hur ofta specifika behandlingar ska användas
- Viktiga tips för produktapplicering

Håll analysen faktabaserad och koncis. Använd ** för betoning av viktiga punkter.`
};

export async function analyzeSkinImage(base64Image: string, language: Language = 'en'): Promise<string> {
  try {
    console.log('Starting Gemini analysis...');
    
    // Remove data URL prefix if present
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