import React from 'react';
import { type Country } from './LanguageSelector';
import { translations } from '@/utils/translations';
import { type AmazonProduct } from '../../supabase/functions/analyze-skin/types';
import ProductSectionsContainer from './analysis/ProductSectionsContainer';

interface AnalysisResultProps {
  condition: string;
  recommendations: {
    moisturizers: AmazonProduct[];
    cleansers: AmazonProduct[];
    exfoliants: AmazonProduct[];
    sunscreens: AmazonProduct[];
    retinols: AmazonProduct[];
  };
  country: Country;
  language: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  recommendations, 
  country, 
  language 
}) => {
  const t = translations[language];

  return (
    <div className="space-y-12">
      <ProductSectionsContainer
        recommendations={recommendations}
        country={country}
        viewOnAmazonText={t.viewOnAmazon}
      />
    </div>
  );
};

export default AnalysisResult;