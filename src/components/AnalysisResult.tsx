import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Country } from './LanguageSelector';
import { translations } from '@/utils/translations';
import { type AmazonProduct } from '../../supabase/functions/analyze-skin/types';
import ProductSection from './analysis/ProductSection';
import SkinConditionSection from './analysis/SkinConditionSection';

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
  condition, 
  recommendations, 
  country, 
  language 
}) => {
  const t = translations[language];

  const mapAmazonProductToProduct = (product: AmazonProduct) => ({
    asin: product.name.split(' ')[0], // Assuming first word is ASIN
    title: product.name,
    url: product.link,
    image: '',  // Add image URL if available
    price: '',  // Add price if available
  });

  return (
    <Card className="w-full mt-8 overflow-hidden font-roboto">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardTitle className="text-2xl">{t.skinAnalysisResults}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <SkinConditionSection 
          condition={condition} 
          title={t.skinCondition} 
        />
        
        <div>
          <h3 className="text-xl font-semibold mb-3">{t.recommendedProducts}</h3>
          <div className="space-y-6">
            <ProductSection
              title="Moisturizers"
              products={recommendations.moisturizers.map(mapAmazonProductToProduct)}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
            <ProductSection
              title="Cleansers"
              products={recommendations.cleansers.map(mapAmazonProductToProduct)}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
            <ProductSection
              title="Exfoliants"
              products={recommendations.exfoliants.map(mapAmazonProductToProduct)}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
            <ProductSection
              title="Sunscreens"
              products={recommendations.sunscreens.map(mapAmazonProductToProduct)}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
            <ProductSection
              title="Retinols"
              products={recommendations.retinols.map(mapAmazonProductToProduct)}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;