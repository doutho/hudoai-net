import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { translations } from '@/utils/translations';
import { type LanguageOption } from '../LanguageSelector';

interface AnalysisHandlerProps {
  images: string[];
  currentLanguage: LanguageOption;
  setIsAnalyzing: (value: boolean) => void;
  setShowDialog: (value: boolean) => void;
  setAnalysisResult: (value: any) => void;
}

const AnalysisHandler = ({
  images,
  currentLanguage,
  setIsAnalyzing,
  setShowDialog,
  setAnalysisResult
}: AnalysisHandlerProps) => {
  const { toast } = useToast();
  const t = translations[currentLanguage.code];

  const handleAnalyze = async () => {
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
      console.log('Sending image data to analyze-skin function...');
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { 
          image: images[0],
          language: currentLanguage.code
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No data received from analysis');
        throw new Error('No data received from analysis');
      }

      console.log('Analysis response:', data);

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

  return { handleAnalyze };
};

export default AnalysisHandler;