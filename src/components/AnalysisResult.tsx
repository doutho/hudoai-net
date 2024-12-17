import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Country } from './LanguageSelector';
import { translations } from '@/utils/translations';

interface Product {
  name: string;
  description: string;
  link: string;
}

interface AnalysisResultProps {
  condition: string;
  recommendations: Product[];
  country: Country;
  language: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ condition, recommendations, country, language }) => {
  const t = translations[language];

  const formatText = (text: string) => {
    // Remove the initial explanation text in Swedish
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
          <div className="grid gap-6 md:grid-cols-2">
            {recommendations.map((product, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={getCountrySpecificLink(product.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-purple-600 text-lg">{product.name}</h4>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <span className="text-sm text-purple-500 hover:text-purple-700">
                          {t.viewOnAmazon} {country !== 'US' ? `(${country})` : ''}
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
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;