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

  // Take only the first product as recommended by Gemini API
  const recommendedProduct = products[0];

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100">
      <h4 className="text-lg font-roboto font-semibold mb-4 text-primary">{title}</h4>
      <ProductCard
        product={recommendedProduct}
        country={country}
        viewOnAmazonText={viewOnAmazonText}
      />
    </div>
  );
};

export default ProductSection;