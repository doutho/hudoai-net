import type { Language } from "./types.ts";

export const geminiPrompts: Record<Language, string> = {
  en: `Please respond in the following format, answers separated by semicolons (;):
Is the person's skin in the image oily, combination, dry, or normal?;
Is the skin tone pale white, white, olive, moderately brown, dark brown, black?;
What is the person's approximate age?;
Does the person have acne? No, mild, moderate, severe.;
Based on this skin analysis, which of the following products is best as a moisturizer? Answer only with the product name exactly as it appears: CeraVe Moisturizing Lotion, La Roche-Posay Effaclar Mat;
Based on this skin analysis, which of the following products is best as a cleanser? Answer only with the product name exactly as it appears: CeraVe Hydrating Facial Cleanser, Cetaphil Gentle Skin Cleanser;
Based on this skin analysis, which of the following products is best as an exfoliant? Answer only with the product name exactly as it appears: Paula's Choice 2% BHA;
Based on this skin analysis, which of the following products is best as a sunscreen? Answer only with the product name exactly as it appears: La Roche-Posay Anthelios, EVY Technology Sunscreen;
Based on this skin analysis, which of the following products is best as a retinol? Answer only with the product name exactly as it appears: The Ordinary Retinol 1%`,
  sv: `Svara i följande format, svar separerade med semikolon (;):
Är personens hud i bilden oljig, kombinerad, torr eller normal?;
Är hudtonen blek vit, vit, olivfärgad, måttligt brun, mörkbrun, svart?;
Vad är personens ungefärliga ålder?;
Har personen akne? Nej, mild, måttlig, svår.;
Baserat på denna hudanalys, vilken av följande produkter är bäst som fuktgivare? Svara endast med produktnamnet exakt som det visas: CeraVe Moisturizing Lotion, La Roche-Posay Effaclar Mat;
Baserat på denna hudanalys, vilken av följande produkter är bäst som rengöring? Svara endast med produktnamnet exakt som det visas: CeraVe Hydrating Facial Cleanser, Cetaphil Gentle Skin Cleanser;
Baserat på denna hudanalys, vilken av följande produkter är bäst som exfoliant? Svara endast med produktnamnet exakt som det visas: Paula's Choice 2% BHA;
Baserat på denna hudanalys, vilken av följande produkter är bäst som solskydd? Svara endast med produktnamnet exakt som det visas: La Roche-Posay Anthelios, EVY Technology Sunscreen;
Baserat på denna hudanalys, vilken av följande produkter är bäst som retinol? Svara endast med produktnamnet exakt som det visas: The Ordinary Retinol 1%`
};