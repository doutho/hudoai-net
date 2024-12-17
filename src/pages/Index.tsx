import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
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
      
      // Ensure we have a properly structured response
      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        
        // Validate the structure
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-start mb-12">
          <img 
            src="/lovable-uploads/869792b2-0779-487f-a7fc-74c4425c1134.png" 
            alt="hudo" 
            className="h-24 md:h-32"
          />
        </div>

        <div className="text-center space-y-4 mb-8">
          <p className="text-xl text-gray-600 font-mono">
            Upload up to 3 images to evaluate your skin condition
          </p>
        </div>

        <ImageUpload
          images={images}
          onImageUpload={handleImageUpload}
          className="mt-8"
        />

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || images.length === 0}
            className="px-8 bg-primary hover:bg-primary/90 text-white"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Images"}
          </Button>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[425px]">
            {isAnalyzing ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full" />
                <p className="text-center text-gray-600">Analyzing your skin...</p>
              </div>
            ) : (
              analysisResult && (
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-4">Analysis Complete</h2>
                  <p className="text-gray-600 mb-4">{analysisResult.condition}</p>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => setShowDialog(false)}
                  >
                    View Detailed Results
                  </Button>
                </div>
              )
            )}
          </DialogContent>
        </Dialog>

        {analysisResult && !showDialog && (
          <AnalysisResult
            condition={analysisResult.condition}
            recommendations={analysisResult.recommendations}
          />
        )}
      </div>
    </div>
  );
};

export default Index;