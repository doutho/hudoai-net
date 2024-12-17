import React from 'react';
import ProductCard from './ProductCard';
import { type Country } from '../LanguageSelector';

interface ProductSectionProps {
  title: string;
  products: Array<{ name: string; description: string; link: string; }>;
  country: Country;
  viewOnAmazonText: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  products, 
  country, 
  viewOnAmazonText 
}) => {
  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-purple-600">{title}</h4>
      <div className="grid gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            description={product.description}
            link={product.link}
            country={country}
            viewOnAmazonText={viewOnAmazonText}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;