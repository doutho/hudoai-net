import React from 'react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import { type LanguageOption } from '@/components/LanguageSelector';
import { translations } from '@/utils/translations';
import { Camera } from 'lucide-react';

interface AnalysisSectionProps {
  images: string[];
  onImageUpload: (index: number, file: File) => void;
  isAnalyzing: boolean;
  handleAnalyze: () => void;
  currentLanguage: LanguageOption;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  images,
  onImageUpload,
  isAnalyzing,
  handleAnalyze,
  currentLanguage
}) => {
  const t = translations[currentLanguage.code];

  return (
    <>
      <div className="text-center space-y-4 mb-8 animate-fade-in">
        <h1 className="text-xl text-white font-roboto font-bold">
          {t.uploadText}
        </h1>
      </div>

      <ImageUpload
        images={images}
        onImageUpload={onImageUpload}
        className="mt-8 animate-fade-in"
        aria-label="Upload skin image"
      />

      <div className="flex justify-center gap-2 mt-8 animate-fade-in">
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || images.length === 0}
          className="px-8 bg-primary hover:bg-primary/90 text-white hover-scale font-roboto"
          aria-busy={isAnalyzing}
        >
          {isAnalyzing ? t.analyzing : t.analyzeButton}
        </Button>
        <Button
          onClick={() => {
            const imageUpload = document.querySelector('input[type="file"]');
            if (imageUpload instanceof HTMLElement) {
              imageUpload.click();
            }
          }}
          variant="ghost"
          size="icon"
          className="bg-primary hover:bg-primary/90 text-white"
          aria-label="Take photo"
        >
          <Camera className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
};

export default AnalysisSection;