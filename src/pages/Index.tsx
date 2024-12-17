import { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type LanguageOption, languageOptions } from '@/components/LanguageSelector';
import AnalysisDialog from '@/components/AnalysisDialog';
import { translations } from '@/utils/translations';
import Header from '@/components/Header';
import WelcomeDialog from '@/components/WelcomeDialog';

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
        option => option.code === savedLanguage.code && option.country === savedLanguage.country
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
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { 
          image: images[0],
          language: currentLanguage.code
        }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from analysis');
      }

      // Log the raw response for debugging
      console.log('Raw response from Edge Function:', data);

      // Ensure we have a valid response structure
      if (!data.condition || !data.recommendations) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure');
      }

      setAnalysisResult(data);
      
      toast({
        title: t.analysisComplete,
        description: t.singleImageSuccess,
      });
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

  const t = translations[currentLanguage.code];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageSelect}
        />

        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <p className="text-xl text-white font-mono">
            {t.uploadText}
          </p>
        </div>

        <ImageUpload
          images={images}
          onImageUpload={handleImageUpload}
          className="mt-8 animate-fade-in"
        />

        <div className="flex justify-center mt-8 animate-fade-in">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || images.length === 0}
            className="px-8 bg-primary hover:bg-primary/90 text-white hover-scale"
          >
            {isAnalyzing ? t.analyzing : t.analyzeButton}
          </Button>
        </div>

        <AnalysisDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          isAnalyzing={isAnalyzing}
          imagesCount={images.length}
          currentLanguage={currentLanguage}
        />

        {analysisResult && !showDialog && (
          <AnalysisResult
            condition={analysisResult.condition}
            recommendations={analysisResult.recommendations}
            country={currentLanguage.country}
            language={currentLanguage.code}
          />
        )}

        <WelcomeDialog
          open={showWelcomeDialog}
          onOpenChange={setShowWelcomeDialog}
          onLanguageSelect={handleLanguageSelect}
        />
      </div>
    </div>
  );
};

export default Index;
