import React, { useRef } from 'react';
import AnalysisResult from '../AnalysisResult';
import { type LanguageOption } from '../LanguageSelector';

interface AnalysisContainerProps {
  analysisResult: any;
  showDialog: boolean;
  currentLanguage: LanguageOption;
}

const AnalysisContainer = ({ 
  analysisResult, 
  showDialog,
  currentLanguage 
}: AnalysisContainerProps) => {
  const analysisResultRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={analysisResultRef}
      aria-label="Analysis Results" 
      className="mb-8"
    >
      {analysisResult && !showDialog && (
        <AnalysisResult
          condition={analysisResult.condition}
          recommendations={analysisResult.recommendations}
          country={currentLanguage.country}
          language={currentLanguage.code}
        />
      )}
    </section>
  );
};

export default AnalysisContainer;