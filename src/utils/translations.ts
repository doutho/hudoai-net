export type Translation = {
  languageChanged: string;
  changedTo: string;
  noImagesError: string;
  analysisComplete: string;
  singleImageSuccess: string;
  analysisError: string;
  uploadText: string;
  analyzing: string;
  analyzeButton: string;
  totalAnalyses: string; // Added for the counter
};

export const translations: Record<string, Translation> = {
  en: {
    languageChanged: "Language changed",
    changedTo: "Changed to {language}",
    noImagesError: "Please upload at least one image.",
    analysisComplete: "Analysis Complete",
    singleImageSuccess: "Your skin analysis was successful!",
    analysisError: "An error occurred during analysis.",
    uploadText: "Upload your skin image",
    analyzing: "Analyzing...",
    analyzeButton: "Analyze",
    totalAnalyses: '{count} skin analyses completed', // Added for the counter
  },
  de: {
    languageChanged: "Sprache geändert",
    changedTo: "Geändert zu {language}",
    noImagesError: "Bitte laden Sie mindestens ein Bild hoch.",
    analysisComplete: "Analyse abgeschlossen",
    singleImageSuccess: "Ihre Hautanalyse war erfolgreich!",
    analysisError: "Ein Fehler ist während der Analyse aufgetreten.",
    uploadText: "Laden Sie Ihr Hautbild hoch",
    analyzing: "Wird analysiert...",
    analyzeButton: "Analysieren",
    totalAnalyses: '{count} Hautanalysen durchgeführt', // Added for the counter
  },
  sv: {
    languageChanged: "Språk ändrat",
    changedTo: "Ändrat till {language}",
    noImagesError: "Vänligen ladda upp minst en bild.",
    analysisComplete: "Analys klar",
    singleImageSuccess: "Din hudanalys var framgångsrik!",
    analysisError: "Ett fel inträffade under analysen.",
    uploadText: "Ladda upp din hudbild",
    analyzing: "Analyserar...",
    analyzeButton: "Analysera",
    totalAnalyses: '{count} hudanalyser genomförda', // Added for the counter
  },
  fr: {
    languageChanged: "Langue changée",
    changedTo: "Changé en {language}",
    noImagesError: "Veuillez télécharger au moins une image.",
    analysisComplete: "Analyse terminée",
    singleImageSuccess: "Votre analyse de la peau a réussi!",
    analysisError: "Une erreur s'est produite lors de l'analyse.",
    uploadText: "Téléchargez votre image de peau",
    analyzing: "Analyse en cours...",
    analyzeButton: "Analyser",
    totalAnalyses: '{count} analyses de peau effectuées', // Added for the counter
  },
};
