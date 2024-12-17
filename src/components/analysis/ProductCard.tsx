import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Country } from '../LanguageSelector';

interface Product {
  asin: string;
  title: string;
  url: string;
  image: string;
  price: string;
}

interface ProductCardProps {
  product: Product;
  country: Country;
  viewOnAmazonText: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  country, 
  viewOnAmazonText 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <article className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-semibold text-primary">{product.title}</h4>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center text-sm text-purple-500 hover:text-purple-700 transition-colors"
                aria-label={`View ${product.title} on Amazon ${country !== 'US' ? `(${country})` : ''}`}
              >
                {viewOnAmazonText} {country !== 'US' ? `(${country})` : ''} 
                <ExternalLink className="w-4 h-4 ml-1" aria-hidden="true" />
              </a>
            </div>
          </article>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to view on Amazon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProductCard;