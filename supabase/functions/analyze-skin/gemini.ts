import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";
import { Language } from "./types.ts";

const translations = {
  en: {
    prompt: `As a dermatologist, analyze this skin image and provide a concise analysis in the following format:

    Brief description of visible skin conditions (2-3 sentences max).

    Based on your skin condition, I recommend:
    - **Cleanser**: [specific type needed] - I recommend the CeraVe Hydrating Facial Cleanser because it's gentle, non-stripping, and contains essential ceramides to maintain skin barrier health
    - **Moisturizer**: [specific type needed] - I recommend the La Roche-Posay Double Repair Face Moisturizer as it provides balanced hydration with ceramides and niacinamide
    - **Exfoliant**: [specific type needed] - I recommend the Paula's Choice 2% BHA Liquid Exfoliant which gently removes dead skin cells and unclogs pores
    - **SPF**: [specific type/strength needed] - I recommend the EltaMD UV Clear Facial Sunscreen SPF 46 because it's lightweight, non-comedogenic, and provides excellent protection
    ${Math.random() > 0.5 ? '- **Retinol**: [specific strength needed] - I recommend The Ordinary Retinol 1% in Squalane as it\'s an effective yet gentle formulation for skin renewal' : ''}

    Please keep the analysis concise and maintain the exact formatting with the bold product categories and specific product recommendations with their benefits.`
  },
  de: {
    prompt: `Analysieren Sie als Dermatologe dieses Hautbild und geben Sie eine prägnante Analyse im folgenden Format:

    Kurze Beschreibung sichtbarer Hautprobleme (maximal 2-3 Sätze).

    Basierend auf Ihrem Hautzustand empfehle ich:
    - **Reiniger**: [spezifischer Typ benötigt] - Ich empfehle den CeraVe Hydrating Facial Cleanser, da er sanft ist, nicht austrocknet und essenzielle Ceramide für die Hautbarriere enthält
    - **Feuchtigkeitspflege**: [spezifischer Typ benötigt] - Ich empfehle die La Roche-Posay Double Repair Gesichtspflege, da sie ausgewogene Feuchtigkeit mit Ceramiden und Niacinamid bietet
    - **Peeling**: [spezifischer Typ benötigt] - Ich empfehle das Paula's Choice 2% BHA Liquid Peeling, das sanft abgestorbene Hautzellen entfernt und Poren reinigt
    - **Sonnenschutz**: [spezifischer Typ/Stärke benötigt] - Ich empfehle den EltaMD UV Clear Sonnenschutz LSF 46, da er leicht ist, nicht komedogen ist und hervorragenden Schutz bietet
    ${Math.random() > 0.5 ? '- **Retinol**: [spezifische Stärke benötigt] - Ich empfehle The Ordinary Retinol 1% in Squalan, da es eine effektive und sanfte Formulierung für die Hauterneuerung ist' : ''}`
  },
  sv: {
    prompt: `Som dermatolog, analysera denna hudbild och ge en koncis analys i följande format:

    Kort beskrivning av synliga hudtillstånd (max 2-3 meningar).

    Baserat på ditt hudtillstånd rekommenderar jag:
    - **Rengöring**: [specifik typ behövs] - Jag rekommenderar CeraVe Hydrating Facial Cleanser eftersom den är mild, inte uttorkande och innehåller essentiella ceramider för hudbarriären
    - **Fuktkräm**: [specifik typ behövs] - Jag rekommenderar La Roche-Posay Double Repair ansiktskräm eftersom den ger balanserad fukt med ceramider och niacinamid
    - **Exfoliering**: [specifik typ behövs] - Jag rekommenderar Paula's Choice 2% BHA Liquid Exfoliant som försiktigt tar bort döda hudceller och rensar porer
    - **Solskydd**: [specifik typ/styrka behövs] - Jag rekommenderar EltaMD UV Clear solskydd SPF 46 eftersom den är lätt, icke-komedogen och ger utmärkt skydd
    ${Math.random() > 0.5 ? '- **Retinol**: [specifik styrka behövs] - Jag rekommenderar The Ordinary Retinol 1% i Squalane eftersom det är en effektiv men mild formulering för hudförnyelse' : ''}`
  }
};

export async function analyzeSkinImage(base64Image: string, language: Language = 'en'): Promise<string> {
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || '');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    console.log('Calling Gemini API with image...');
    
    const result = await model.generateContent([
      translations[language].prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    console.log('Gemini API Response:', text);
    return text;
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}