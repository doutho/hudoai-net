import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Country } from './LanguageSelector';
import { translations } from '@/utils/translations';
import { type ProductRecommendations } from '../../supabase/functions/analyze-skin/types';

interface AnalysisResultProps {
  condition: string;
  recommendations: ProductRecommendations;
  country: Country;
  language: string;
}

const ProductSection: React.FC<{
  title: string;
  products: Array<{ name: string; description: string; link: string; }>;
  country: Country;
  viewOnAmazonText: string;
}> = ({ title, products, country, viewOnAmazonText }) => {
  const getCountrySpecificLink = (link: string) => {
    const asinMatch = link.match(/\/dp\/([A-Z0-9]+)/);
    if (!asinMatch) return link;

    const asin = asinMatch[1];
    const domainMap = {
      'US': 'amazon.com',
      'UK': 'amazon.co.uk',
      'DE': 'amazon.de',
      'SE': 'amazon.se'
    };

    return `https://www.${domainMap[country]}/dp/${asin}`;
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-purple-600">{title}</h4>
      <div className="grid gap-4">
        {products.map((product, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={getCountrySpecificLink(product.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-purple-600">{product.name}</h5>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <span className="text-sm text-purple-500 hover:text-purple-700">
                      {viewOnAmazonText} {country !== 'US' ? `(${country})` : ''}
                    </span>
                  </div>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view on Amazon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ condition, recommendations, country, language }) => {
  const t = translations[language];

  const formatText = (text: string) => {
    const cleanedText = text.replace(/^Ja.*ser\.\n\n/, '');
    
    return cleanedText.split('\n').map((line, index) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-purple-600">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      
      return (
        <p key={index} className="mb-2">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <Card className="w-full mt-8 overflow-hidden font-roboto">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardTitle className="text-2xl">{t.skinAnalysisResults}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">{t.skinCondition}</h3>
          <div className="text-gray-700 leading-relaxed">
            {formatText(condition)}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">{t.recommendedProducts}</h3>
          <div className="space-y-6">
            <ProductSection
              title="Moisturizers"
              products={recommendations.moisturizers}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
            <ProductSection
              title="Cleansers"
              products={recommendations.cleansers}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
            <ProductSection
              title="Exfoliants"
              products={recommendations.exfoliants}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
            <ProductSection
              title="Sunscreens"
              products={recommendations.sunscreens}
              country={country}
              viewOnAmazonText={t.viewOnAmazon}
            />
            <ProductSection
              title="Retinols"
              products={recommendations.retinols}
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