import React from 'react';
import ProductCard from './ProductCard';
import { type Country } from '../LanguageSelector';

interface Product {
  asin: string;
  title: string;
  url: string;
  image: string;
  price: string;
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
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h4 className="text-lg font-roboto font-semibold mb-4 text-primary">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            country={country}
            viewOnAmazonText={viewOnAmazonText}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;