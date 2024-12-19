import React from 'react';
import ProductCard from './ProductCard';
import { type Country } from '../LanguageSelector';

interface Product {
  asin: string;
  title: string;
  url: string;
  image: string;
  price: string;
  description: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  country: Country;
  viewOnAmazonText: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  country,
  viewOnAmazonText
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <h4 className="text-xl font-roboto font-semibold mb-4 text-primary">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div 
            key={product.asin}
            className="opacity-0 animate-fade-in"
            style={{ 
              animationDelay: `${index * 0.2}s`,
              animationFillMode: 'forwards'
            }}
          >
            <ProductCard
              product={product}
              country={country}
              viewOnAmazonText={viewOnAmazonText}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;