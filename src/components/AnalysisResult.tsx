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

  const mapAmazonProductToProduct = (product: AmazonProduct) => {
    if (!product) return null;
    
    return {
      asin: product.asin || '',
      title: product.name || '',
      url: product.link || '',
      image: product.image || '',
      price: product.price || '',
    };
  };

  return (
    <Card className="w-full mt-8 overflow-hidden font-roboto">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardTitle className="text-2xl">{t.skinAnalysisResults}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Skin Analysis */}
          <div className="lg:border-r lg:pr-6">
            <SkinConditionSection 
              condition={condition} 
              title={t.skinCondition} 
            />
          </div>
          
          {/* Right column: Product Recommendations */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-primary">{t.recommendedProducts}</h3>
            <div className="grid gap-6">
              {recommendations.moisturizers?.length > 0 && (
                <ProductSection
                  title="Moisturizer"
                  products={recommendations.moisturizers.map(mapAmazonProductToProduct).filter(Boolean)}
                  country={country}
                  viewOnAmazonText={t.viewOnAmazon}
                />
              )}
              {recommendations.cleansers?.length > 0 && (
                <ProductSection
                  title="Cleanser"
                  products={recommendations.cleansers.map(mapAmazonProductToProduct).filter(Boolean)}
                  country={country}
                  viewOnAmazonText={t.viewOnAmazon}
                />
              )}
              {recommendations.exfoliants?.length > 0 && (
                <ProductSection
                  title="Exfoliant"
                  products={recommendations.exfoliants.map(mapAmazonProductToProduct).filter(Boolean)}
                  country={country}
                  viewOnAmazonText={t.viewOnAmazon}
                />
              )}
              {recommendations.sunscreens?.length > 0 && (
                <ProductSection
                  title="Sunscreen"
                  products={recommendations.sunscreens.map(mapAmazonProductToProduct).filter(Boolean)}
                  country={country}
                  viewOnAmazonText={t.viewOnAmazon}
                />
              )}
              {recommendations.retinols?.length > 0 && (
                <ProductSection
                  title="Retinol"
                  products={recommendations.retinols.map(mapAmazonProductToProduct).filter(Boolean)}
                  country={country}
                  viewOnAmazonText={t.viewOnAmazon}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;