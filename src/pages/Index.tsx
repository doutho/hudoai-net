import { useState, useEffect } from 'react';
import AnalysisSection from '@/components/analysis/AnalysisSection';
import AnalysisContainer from '@/components/analysis/AnalysisContainer';
import { type LanguageOption, languageOptions } from '@/components/LanguageSelector';
import AnalysisDialog from '@/components/AnalysisDialog';
import Header from '@/components/Header';
import WelcomeDialog from '@/components/WelcomeDialog';
import SparkleRain from '@/components/SparkleRain';
import Footer from '@/components/Footer';
import AnalysisHandler from '@/components/analysis/AnalysisHandler';
import { useToast } from '@/hooks/use-toast';
import { translations } from '@/utils/translations';

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(languageOptions[0]);
  const { toast } = useToast();

  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('selectedLanguage');
    if (!hasSelectedLanguage) {
      setShowWelcomeDialog(true);
    } else {
      const savedLanguage = JSON.parse(hasSelectedLanguage);
      const foundLanguage = languageOptions.find(
        option => option.code === savedLanguage.code
      );
      if (foundLanguage) {
        setCurrentLanguage(foundLanguage);
      }
    }
  }, []);

  const handleLanguageSelect = (option: LanguageOption) => {
    setCurrentLanguage(option);
    localStorage.setItem('selectedLanguage', JSON.stringify(option));
    const t = translations[option.code];
    toast({
      title: t.languageChanged,
      description: t.changedTo.replace('{language}', option.label),
    });
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...images];
      newImages[index] = e.target?.result as string;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const { handleAnalyze } = AnalysisHandler({
    images,
    currentLanguage,
    setIsAnalyzing,
    setShowDialog,
    setAnalysisResult,
  });

  return (
    <main className="min-h-screen p-4 md:p-8" role="main">
      <SparkleRain />
      <div className="max-w-4xl mx-auto">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageSelect}
        />

        <section aria-label="Skin Analysis Upload" className="mb-8">
          <AnalysisSection
            images={images}
            onImageUpload={handleImageUpload}
            isAnalyzing={isAnalyzing}
            handleAnalyze={handleAnalyze}
            currentLanguage={currentLanguage}
          />
        </section>

        <AnalysisDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          isAnalyzing={isAnalyzing}
          imagesCount={images.length}
          currentLanguage={currentLanguage}
        />

        <AnalysisContainer 
          analysisResult={analysisResult}
          showDialog={showDialog}
          currentLanguage={currentLanguage}
        />

        <WelcomeDialog
          open={showWelcomeDialog}
          onOpenChange={setShowWelcomeDialog}
          onLanguageSelect={handleLanguageSelect}
        />

        <Footer />
      </div>
    </main>
  );
};

export default Index;