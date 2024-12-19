import React, { useEffect, useRef, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px' // Start animation slightly before the element comes into view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <div 
      ref={sectionRef}
      className="w-full py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h4 className="text-3xl font-bold text-primary mb-8 text-center">{title}</h4>
        <div className="grid grid-cols-1 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.asin}
              className={`transform transition-all duration-1000 ease-out
                ${isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-full'
                }`}
              style={{ 
                transitionDelay: `${index * 200}ms`
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