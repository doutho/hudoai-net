import React from 'react';
import { ExternalLink } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { type Country } from '../LanguageSelector';
import { Button } from '@/components/ui/button';

interface Product {
  asin: string;
  title: string;
  url: string;
  image: string;
  price: string;
  description: string;
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
          <article className="h-full flex flex-col p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex-1 space-y-4">
              <h4 className="text-lg font-semibold text-primary line-clamp-2">{product.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
              {product.price && (
                <p className="text-lg font-semibold text-primary">{product.price}</p>
              )}
            </div>
            <div className="mt-4">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full"
              >
                <Button 
                  className="w-full"
                  variant="default"
                >
                  {viewOnAmazonText} ({country})
                  <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </a>
            </div>
          </article>
        </TooltipTrigger>
        <TooltipContent>
          <p>Klicka för att visa på Amazon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProductCard;