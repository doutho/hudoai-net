import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="w-full mt-8 overflow-hidden font-roboto">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
          <CardTitle className="text-2xl">{t.skinAnalysisResults}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ProductSectionsContainer
            recommendations={recommendations}
            country={country}
            viewOnAmazonText={t.viewOnAmazon}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResult;