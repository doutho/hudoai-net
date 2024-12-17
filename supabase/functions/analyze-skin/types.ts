export type Language = 'en' | 'de' | 'sv';
export type Country = 'US' | 'DE' | 'UK' | 'SE';

export interface AmazonProduct {
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
  treatments: AmazonProduct[];
}

export interface AnalysisResponse {
  condition: string;
  recommendations: ProductRecommendations;
}