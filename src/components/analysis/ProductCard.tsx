import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Country } from '../LanguageSelector';

interface ProductCardProps {
  name: string;
  description: string;
  link: string;
  country: Country;
  viewOnAmazonText: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  description, 
  link, 
  country, 
  viewOnAmazonText 
}) => {
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={getCountrySpecificLink(link)}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <h5 className="font-medium text-purple-600">{name}</h5>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">{description}</p>
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
  );
};

export default ProductCard;