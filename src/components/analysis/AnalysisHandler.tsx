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
      // Ensure we have a valid base64 image
      const imageData = images[0].startsWith('data:') 
        ? images[0]
        : `data:image/jpeg;base64,${images[0]}`;

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { 
          image: imageData,
          language: currentLanguage.code
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response from Edge Function:', { data, error });

      if (error) {
        throw new Error(error.message || 'Error during analysis');
      }

      if (!data) {
        throw new Error('No data received from analysis');
      }

      if (!data.condition || !data.recommendations) {
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