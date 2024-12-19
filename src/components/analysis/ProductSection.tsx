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
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h4 className="text-3xl font-bold text-primary mb-8 text-center">{title}</h4>
        <div className="grid grid-cols-1 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.asin}
              className="opacity-0 transform translate-x-full"
              style={{ 
                animation: `slideIn 0.6s ease-out ${index * 0.2}s forwards`
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
    </div>
  );
};

export default ProductSection;