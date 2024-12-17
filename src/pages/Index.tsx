import { useState, useEffect, useRef } from 'react';
import AnalysisSection from '@/components/analysis/AnalysisSection';
import AnalysisResult from '@/components/AnalysisResult';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type LanguageOption, languageOptions } from '@/components/LanguageSelector';
import AnalysisDialog from '@/components/AnalysisDialog';
import { translations } from '@/utils/translations';
import Header from '@/components/Header';
import WelcomeDialog from '@/components/WelcomeDialog';
import SparkleRain from '@/components/SparkleRain';
import Footer from '@/components/Footer';

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(languageOptions[0]);
  const { toast } = useToast();
  const analysisResultRef = useRef<HTMLDivElement>(null);

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

  const handleAnalyze = async () => {
    const t = translations[currentLanguage.code];
    
    if (images.length === 0) {
      toast({
        title: "Error",
        description: t.noImagesError,
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setShowDialog(true);
    
    try {
      const imageData = images[0].includes('base64,') 
        ? images[0]
        : `data:image/jpeg;base64,${images[0]}`;

      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { 
          image: imageData,
          language: currentLanguage.code
        }
      });

      if (error) throw error;
      if (!data) throw new Error('No data received from analysis');

      console.log('Raw response from Edge Function:', data);

      if (!data.condition || !data.recommendations) {
        throw new Error('Invalid response structure');
      }

      setAnalysisResult(data);
      
      toast({
        title: t.analysisComplete,
        description: t.singleImageSuccess,
      });

      // After analysis is complete and dialog is closed, scroll to results
      setTimeout(() => {
        analysisResultRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (error) {
      console.error('Error during analysis:', error);
      setShowDialog(false);
      toast({
        title: "Error",
        description: error.message || t.analysisError,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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

        {analysisResult && !showDialog && (
          <section 
            ref={analysisResultRef}
            aria-label="Analysis Results" 
            className="mb-8"
          >
            <AnalysisResult
              condition={analysisResult.condition}
              recommendations={analysisResult.recommendations}
              country={currentLanguage.country}
              language={currentLanguage.code}
            />
          </section>
        )}

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
