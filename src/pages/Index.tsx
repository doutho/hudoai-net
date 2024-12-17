import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LanguageSelector, { type LanguageOption, languageOptions } from '@/components/LanguageSelector';
import { CheckCircle2 } from 'lucide-react';

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(languageOptions[0]);
  const { toast } = useToast();

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...images];
      newImages[index] = e.target?.result as string;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleLanguageChange = (option: LanguageOption) => {
    setCurrentLanguage(option);
    toast({
      title: "Language Changed",
      description: `Changed to ${option.label}`,
    });
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setShowDialog(true);
    
    try {
      console.log('Calling analyze-skin function with image data...');
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { image: images[0] }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from analysis');
      }

      console.log('Analysis response:', data);
      
      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        
        if (!parsedData.condition || !Array.isArray(parsedData.recommendations)) {
          throw new Error('Invalid response structure');
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Failed to parse analysis results');
      }
      
      setAnalysisResult(parsedData);
      
      toast({
        title: "Analysis complete",
        description: "Your skin analysis results are ready",
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      setShowDialog(false);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <img 
            src="/lovable-uploads/869792b2-0779-487f-a7fc-74c4425c1134.png" 
            alt="hudo" 
            className="h-12 md:h-16 hover-scale"
          />
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <p className="text-xl text-white font-mono">
            Upload up to 3 images to evaluate your skin condition
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
            {isAnalyzing ? "Analyzing..." : "Analyze Images"}
          </Button>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Skin Analysis</DialogTitle>
              <DialogDescription>
                {isAnalyzing ? "Processing your skin analysis..." : "Analysis Complete"}
              </DialogDescription>
            </DialogHeader>
            {isAnalyzing ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <div className="p-4 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <p className="text-gray-600 mb-4">
                  {images.length > 1 
                    ? "Your images have been analyzed successfully!" 
                    : "Your image has been analyzed successfully!"}
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setShowDialog(false)}
                >
                  View Detailed Results
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {analysisResult && !showDialog && (
          <AnalysisResult
            condition={analysisResult.condition}
            recommendations={analysisResult.recommendations}
            country={currentLanguage.country}
          />
        )}
      </div>
    </div>
  );
};

export default Index;