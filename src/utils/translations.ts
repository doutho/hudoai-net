export type Translation = {
  languageChanged: string;
  changedTo: string;
  noImagesError: string;
  analysisComplete: string;
  singleImageSuccess: string;
  multipleImagesSuccess: string;
  analysisError: string;
  uploadText: string;
  analyzing: string;
  analyzeButton: string;
  totalAnalyses: string;
  analysisTitle: string;
  analysisProcessing: string;
  viewResults: string;
  skinAnalysisResults: string;
  skinCondition: string;
  recommendedProducts: string;
  viewOnAmazon: string;
  uploadImages: string;
  uploadDescription: string;
  aiAnalysis: string;
  aiDescription: string;
  recommendations: string;
  recommendationsDescription: string;
  howItWorks: string;
  tryItNow: string;
};

export const translations: Record<string, Translation> = {
  en: {
    languageChanged: "Language changed",
    changedTo: "Changed to {language}",
    noImagesError: "Please upload at least one image.",
    analysisComplete: "Analysis Complete",
    singleImageSuccess: "Your skin analysis was successful!",
    multipleImagesSuccess: "Your skin analyses were successful!",
    analysisError: "An error occurred during analysis.",
    uploadText: "Upload your skin image",
    analyzing: "Analyzing...",
    analyzeButton: "Analyze",
    totalAnalyses: '{count} skin analyses completed',
    analysisTitle: "Skin Analysis",
    analysisProcessing: "Processing your skin analysis...",
    viewResults: "View Results",
    skinAnalysisResults: "Skin Analysis Results",
    skinCondition: "Your Skin Condition",
    recommendedProducts: "Recommended Products",
    viewOnAmazon: "View on Amazon",
    uploadImages: "Upload Images",
    uploadDescription: "Take or upload clear photos of your skin in good lighting",
    aiAnalysis: "AI Analysis",
    aiDescription: "Our advanced AI analyzes your skin's condition and concerns",
    recommendations: "Recommendations",
    recommendationsDescription: "Get personalized product recommendations and skincare routine",
    howItWorks: "How It Works",
    tryItNow: "Try It Now"
  },
  de: {
    languageChanged: "Sprache geändert",
    changedTo: "Geändert zu {language}",
    noImagesError: "Bitte laden Sie mindestens ein Bild hoch.",
    analysisComplete: "Analyse abgeschlossen",
    singleImageSuccess: "Ihre Hautanalyse war erfolgreich!",
    multipleImagesSuccess: "Ihre Hautanalysen waren erfolgreich!",
    analysisError: "Ein Fehler ist während der Analyse aufgetreten.",
    uploadText: "Laden Sie Ihr Hautbild hoch",
    analyzing: "Wird analysiert...",
    analyzeButton: "Analysieren",
    totalAnalyses: '{count} Hautanalysen durchgeführt',
    analysisTitle: "Hautanalyse",
    analysisProcessing: "Ihre Hautanalyse wird verarbeitet...",
    viewResults: "Ergebnisse anzeigen",
    skinAnalysisResults: "Hautanalyse-Ergebnisse",
    skinCondition: "Ihr Hautzustand",
    recommendedProducts: "Empfohlene Produkte",
    viewOnAmazon: "Auf Amazon ansehen",
    uploadImages: "Bilder hochladen",
    uploadDescription: "Machen oder laden Sie klare Fotos Ihrer Haut bei guter Beleuchtung",
    aiAnalysis: "KI-Analyse",
    aiDescription: "Unsere fortschrittliche KI analysiert den Zustand und die Probleme Ihrer Haut",
    recommendations: "Empfehlungen",
    recommendationsDescription: "Erhalten Sie personalisierte Produktempfehlungen und Hautpflegeroutine",
    howItWorks: "Wie es funktioniert",
    tryItNow: "Jetzt ausprobieren"
  },
  sv: {
    languageChanged: "Språk ändrat",
    changedTo: "Ändrat till {language}",
    noImagesError: "Vänligen ladda upp minst en bild.",
    analysisComplete: "Analys klar",
    singleImageSuccess: "Din hudanalys var framgångsrik!",
    multipleImagesSuccess: "Dina hudanalyser var framgångsrika!",
    analysisError: "Ett fel inträffade under analysen.",
    uploadText: "Ladda upp din hudbild",
    analyzing: "Analyserar...",
    analyzeButton: "Analysera",
    totalAnalyses: '{count} hudanalyser genomförda',
    analysisTitle: "Hudanalys",
    analysisProcessing: "Din hudanalys bearbetas...",
    viewResults: "Visa resultat",
    skinAnalysisResults: "Hudanalysresultat",
    skinCondition: "Ditt hudtillstånd",
    recommendedProducts: "Rekommenderade produkter",
    viewOnAmazon: "Visa på Amazon",
    uploadImages: "Ladda upp bilder",
    uploadDescription: "Ta eller ladda upp tydliga foton av din hud i bra belysning",
    aiAnalysis: "AI-analys",
    aiDescription: "Vår avancerade AI analyserar din huds tillstånd och problem",
    recommendations: "Rekommendationer",
    recommendationsDescription: "Få personliga produktrekommendationer och hudvårdsrutin",
    howItWorks: "Hur det fungerar",
    tryItNow: "Prova nu"
  },
  fr: {
    languageChanged: "Langue modifiée",
    changedTo: "Changé en {language}",
    noImagesError: "Veuillez télécharger au moins une image.",
    analysisComplete: "Analyse terminée",
    singleImageSuccess: "Votre analyse de peau a réussi !",
    multipleImagesSuccess: "Vos analyses de peau ont réussi !",
    analysisError: "Une erreur s'est produite lors de l'analyse.",
    uploadText: "Téléchargez votre image de peau",
    analyzing: "Analyse en cours...",
    analyzeButton: "Analyser",
    totalAnalyses: '{count} analyses de peau effectuées',
    analysisTitle: "Analyse de peau",
    analysisProcessing: "Votre analyse de peau est en cours...",
    viewResults: "Voir les résultats",
    skinAnalysisResults: "Résultats de l'analyse de peau",
    skinCondition: "État de votre peau",
    recommendedProducts: "Produits recommandés",
    viewOnAmazon: "Voir sur Amazon",
    uploadImages: "Télécharger des images",
    uploadDescription: "Prenez ou téléchargez des photos claires de votre peau sous un bon éclairage",
    aiAnalysis: "Analyse IA",
    aiDescription: "Notre IA avancée analyse l'état et les problèmes de votre peau",
    recommendations: "Recommandations",
    recommendationsDescription: "Obtenez des recommandations de produits et une routine de soin personnalisées",
    howItWorks: "Comment ça marche",
    tryItNow: "Essayer maintenant"
  }
};