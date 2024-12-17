import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
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
    try {
      // Mock analysis result for now - will be replaced with actual API call
      const mockResult = {
        condition: "Mild dryness with slight redness",
        recommendations: [
          {
            name: "CeraVe Moisturizing Cream",
            description: "Rich, non-irritating moisturizer for dry skin",
            link: "#"
          },
          {
            name: "La Roche-Posay Cicaplast",
            description: "Soothing balm for irritated skin",
            link: "#"
          }
        ]
      };
      
      setAnalysisResult(mockResult);
      toast({
        title: "Analysis complete",
        description: "Your skin analysis results are ready",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">hudo</h1>
          <p className="text-xl text-gray-600 font-mono">
            Upload up to 3 images to evaluate your skin condition
          </p>
        </div>

        <ImageUpload
          images={images}
          onImageUpload={handleImageUpload}
          className="mt-8"
        />

        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || images.length === 0}
            className="px-8"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Images"}
          </Button>
        </div>

        {analysisResult && (
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