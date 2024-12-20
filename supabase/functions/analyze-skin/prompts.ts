import type { Language } from "./types.ts";

export const geminiPrompts: Record<Language, string> = {
  en: `Please respond in the following format, answers separated by semicolons (;):
Is the person's skin in the image oily, combination, dry, or normal?;
Is the skin tone pale white, white, olive, moderately brown, dark brown, black?;
What is the person's approximate age?;
Does the person have acne? No, mild, moderate, severe.;
Based on this skin analysis, which of the following products is best as a moisturizer? Answer only with the product name exactly as it appears: CeraVe Moisturizing Lotion, La Roche-Posay Effaclar Mat;
For the chosen moisturizer, provide a concise personalized description of why it's suitable for this person's skin, mentioning their specific skin condition, including usage instructions (when and how to apply);
Based on this skin analysis, which of the following products is best as a cleanser? Answer only with the product name exactly as it appears: CeraVe Hydrating Facial Cleanser, Cetaphil Gentle Skin Cleanser;
For the chosen cleanser, provide a concise personalized description of why it's suitable for this person's skin, mentioning their specific skin condition, including usage instructions (when and how to apply);
Based on this skin analysis, which of the following products is best as an exfoliant? Answer only with the product name exactly as it appears: Paula's Choice 2% BHA;
For the chosen exfoliant, provide a concise personalized description of why it's suitable for this person's skin, mentioning their specific skin condition, including usage instructions (when and how to apply);
Based on this skin analysis, which of the following products is best as a sunscreen? Answer only with the product name exactly as it appears: La Roche-Posay Anthelios, EVY Technology Sunscreen;
For the chosen sunscreen, provide a concise personalized description of why it's suitable for this person's skin, mentioning their specific skin condition, including usage instructions (when and how to apply);
Based on this skin analysis, which of the following products is best as a retinol? Answer only with the product name exactly as it appears: The Ordinary Retinol 1%;
For the chosen retinol, provide a concise personalized description of why it's suitable for this person's skin, mentioning their specific skin condition, including usage instructions (when and how to apply)`,

  sv: `Svara i följande format, svar separerade med semikolon (;):
Är personens hud i bilden oljig, kombinerad, torr eller normal?;
Är hudtonen blek vit, vit, olivfärgad, måttligt brun, mörkbrun, svart?;
Vad är personens ungefärliga ålder?;
Har personen akne? Nej, mild, måttlig, svår.;
Baserat på denna hudanalys, vilken av följande produkter är bäst som fuktgivare? Svara endast med produktnamnet exakt som det visas: CeraVe Moisturizing Lotion, La Roche-Posay Effaclar Mat;
För den valda fuktgivaren, ge en koncis personlig beskrivning av varför den passar denna persons hud, nämn deras specifika hudtillstånd, inklusive användningsinstruktioner (när och hur den ska appliceras);
Baserat på denna hudanalys, vilken av följande produkter är bäst som rengöring? Svara endast med produktnamnet exakt som det visas: CeraVe Hydrating Facial Cleanser, Cetaphil Gentle Skin Cleanser;
För den valda rengöringen, ge en koncis personlig beskrivning av varför den passar denna persons hud, nämn deras specifika hudtillstånd, inklusive användningsinstruktioner (när och hur den ska appliceras);
Baserat på denna hudanalys, vilken av följande produkter är bäst som exfoliant? Svara endast med produktnamnet exakt som det visas: Paula's Choice 2% BHA;
För den valda exfolianten, ge en koncis personlig beskrivning av varför den passar denna persons hud, nämn deras specifika hudtillstånd, inklusive användningsinstruktioner (när och hur den ska appliceras);
Baserat på denna hudanalys, vilken av följande produkter är bäst som solskydd? Svara endast med produktnamnet exakt som det visas: La Roche-Posay Anthelios, EVY Technology Sunscreen;
För det valda solskyddet, ge en koncis personlig beskrivning av varför det passar denna persons hud, nämn deras specifika hudtillstånd, inklusive användningsinstruktioner (när och hur det ska appliceras);
Baserat på denna hudanalys, vilken av följande produkter är bäst som retinol? Svara endast med produktnamnet exakt som det visas: The Ordinary Retinol 1%;
För den valda retinolen, ge en koncis personlig beskrivning av varför den passar denna persons hud, nämn deras specifika hudtillstånd, inklusive användningsinstruktioner (när och hur den ska appliceras)`
};