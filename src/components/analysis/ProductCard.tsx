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
          <article className="flex flex-col p-8 bg-gradient-to-br from-pink-200 via-pink-300 to-pink-200 rounded-xl shadow-lg border border-pink-300 hover:shadow-xl transition-all duration-300 min-h-[500px] w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-64 h-64 shrink-0 mx-auto md:mx-0 overflow-hidden rounded-lg bg-white p-4">
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="flex-1 space-y-6">
                <h4 className="text-xl font-semibold text-primary line-clamp-2">{product.title}</h4>
                <p className="text-gray-700 line-clamp-3">{product.description}</p>
                {product.price && (
                  <p className="text-xl font-semibold text-primary">{product.price}</p>
                )}
                <div className="pt-4">
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
              </div>
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