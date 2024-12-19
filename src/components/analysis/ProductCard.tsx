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
          <article className="flex flex-col p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 min-h-[500px] w-full max-w-md mx-auto">
            <div className="flex-1 space-y-6">
              <div className="w-64 h-64 mx-auto overflow-hidden rounded-lg">
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h4 className="text-xl font-semibold text-primary line-clamp-2">{product.title}</h4>
              <p className="text-gray-600 line-clamp-3">{product.description}</p>
              {product.price && (
                <p className="text-xl font-semibold text-primary">{product.price}</p>
              )}
            </div>
            <div className="mt-6">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="w-full"
              >
                <Button 
                  className="w-full text-lg py-6"
                  variant="default"
                >
                  {viewOnAmazonText} ({country})
                  <ExternalLink className="w-5 h-5 ml-2" aria-hidden="true" />
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