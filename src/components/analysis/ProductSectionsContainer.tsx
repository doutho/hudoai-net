import React from 'react';
import ProductSection from './ProductSection';
import { type Country } from '../LanguageSelector';
import { type AmazonProduct } from '../../../supabase/functions/analyze-skin/types';

interface ProductSectionsContainerProps {
  recommendations: {
    moisturizers: AmazonProduct[];
    cleansers: AmazonProduct[];
    exfoliants: AmazonProduct[];
    sunscreens: AmazonProduct[];
    retinols: AmazonProduct[];
  };
  country: Country;
  viewOnAmazonText: string;
}

const ProductSectionsContainer: React.FC<ProductSectionsContainerProps> = ({
  recommendations,
  country,
  viewOnAmazonText
}) => {
  const mapAmazonProductToProduct = (product: AmazonProduct) => {
    if (!product) return null;
    
    return {
      asin: product.asin || '',
      title: product.name || '',
      url: product.link || '',
      image: product.image || '',
      price: product.price || '',
      description: product.description || 'Ingen beskrivning tillgänglig', // Added description with Swedish default
    };
  };

  return (
    <div className="space-y-6">
      {recommendations.moisturizers?.length > 0 && (
        <ProductSection
          title="Moisturizer"
          products={recommendations.moisturizers.map(mapAmazonProductToProduct).filter(Boolean)}
          country={country}
          viewOnAmazonText={viewOnAmazonText}
        />
      )}
      {recommendations.cleansers?.length > 0 && (
        <ProductSection
          title="Cleanser"
          products={recommendations.cleansers.map(mapAmazonProductToProduct).filter(Boolean)}
          country={country}
          viewOnAmazonText={viewOnAmazonText}
        />
      )}
      {recommendations.exfoliants?.length > 0 && (
        <ProductSection
          title="Exfoliant"
          products={recommendations.exfoliants.map(mapAmazonProductToProduct).filter(Boolean)}
          country={country}
          viewOnAmazonText={viewOnAmazonText}
        />
      )}
      {recommendations.sunscreens?.length > 0 && (
        <ProductSection
          title="Sunscreen"
          products={recommendations.sunscreens.map(mapAmazonProductToProduct).filter(Boolean)}
          country={country}
          viewOnAmazonText={viewOnAmazonText}
        />
      )}
      {recommendations.retinols?.length > 0 && (
        <ProductSection
          title="Retinol"
          products={recommendations.retinols.map(mapAmazonProductToProduct).filter(Boolean)}
          country={country}
          viewOnAmazonText={viewOnAmazonText}
        />
      )}
    </div>
  );
};

export default ProductSectionsContainer;