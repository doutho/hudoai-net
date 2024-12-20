export type Language = 'en' | 'sv';
export type Country = 'US' | 'SE';

export interface AmazonProduct {
  asin?: string;
  name: string;
  description: string;
  link: string;
  image: string;
  price: string;
}

export interface ProductRecommendations {
  moisturizers: AmazonProduct[];
  cleansers: AmazonProduct[];
  exfoliants: AmazonProduct[];
  sunscreens: AmazonProduct[];
  retinols: AmazonProduct[];
}

export interface AnalysisResponse {
  condition: string;
  recommendations: ProductRecommendations;
}

export interface GeminiResponse {
  skinType: string;
  skinTone: string;
  age: number;
  acnePresence: string;
  recommendedProducts: {
    moisturizer: string;
    cleanser: string;
    exfoliant: string;
    sunscreen: string;
    retinol: string;
  };
}