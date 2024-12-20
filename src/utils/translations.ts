export const translations = {
  en: {
    uploadText: "Upload a photo to get AI-powered personalized skincare recommendations",
    analyzeButton: "Analyze photo",
    analyzing: "Analyzing...",
    analysisTitle: "Skin Analysis",
    analysisProcessing: "Processing your skin analysis...",
    analysisComplete: "Analysis Complete",
    singleImageSuccess: "Your image has been successfully analyzed!",
    multipleImagesSuccess: "Your images have been successfully analyzed!",
    viewResults: "View detailed results",
    noImagesError: "Please upload at least one image",
    analysisError: "Failed to analyze images. Please try again.",
    skinAnalysisResults: "Your Skin Analysis Results",
    skinCondition: "Skin Condition",
    recommendedProducts: "Recommended Products",
    viewOnAmazon: "View on Amazon",
    languageChanged: "Language Changed",
    changedTo: "Changed to {language}",
    // How It Works page translations
    howItWorksTitle: "How It Works",
    uploadStepTitle: "Upload Your Images",
    uploadStepDescription: "Take clear photos of your skin concerns and upload them to our platform.",
    analysisStepTitle: "AI Analysis",
    analysisStepDescription: "Our advanced AI technology analyzes your skin condition and identifies potential concerns.",
    recommendationsStepTitle: "Get Personalized Recommendations",
    recommendationsStepDescription: "Receive tailored product recommendations and skincare advice based on your analysis.",
    tryItNowButton: "Try It Now"
  },
  sv: {
    uploadText: "Ladda upp en bild för att få en personlig hudvårdsrutin med hjälp av AI",
    analyzeButton: "Analysera bild",
    analyzing: "Analyserar...",
    analysisTitle: "Hudanalys",
    analysisProcessing: "Din hudanalys bearbetas...",
    analysisComplete: "Analys slutförd",
    singleImageSuccess: "Din bild har analyserats framgångsrikt!",
    multipleImagesSuccess: "Dina bilder har analyserats framgångsrikt!",
    viewResults: "Visa detaljerade resultat",
    noImagesError: "Vänligen ladda upp minst en bild",
    analysisError: "Det gick inte att analysera bilderna. Försök igen.",
    skinAnalysisResults: "Dina hudanalysresultat",
    skinCondition: "Hudtillstånd",
    recommendedProducts: "Rekommenderade produkter",
    viewOnAmazon: "Visa på Amazon",
    languageChanged: "Språk ändrat",
    changedTo: "Ändrat till {language}",
    // How It Works page translations
    howItWorksTitle: "Hur det fungerar",
    uploadStepTitle: "Ladda upp dina bilder",
    uploadStepDescription: "Ta tydliga foton av dina hudproblem och ladda upp dem till vår plattform.",
    analysisStepTitle: "AI-analys",
    analysisStepDescription: "Vår avancerade AI-teknik analyserar ditt hudtillstånd och identifierar potentiella problem.",
    recommendationsStepTitle: "Få personliga rekommendationer",
    recommendationsStepDescription: "Få skräddarsydda produktrekommendationer och hudvårdsråd baserat på din analys.",
    tryItNowButton: "Prova nu"
  }
};

export const geminiPrompts = {
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