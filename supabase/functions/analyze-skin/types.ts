export type Language = 'en' | 'de' | 'sv';
export type Country = 'US' | 'DE' | 'UK' | 'SE';

export interface Product {
  name: string;
  description: string;
  link: string;
}

export interface ProductRecommendations {
  moisturizers: Product[];
  cleansers: Product[];
  exfoliants: Product[];
  sunscreens: Product[];
  retinols: Product[];
}

export interface AnalysisResponse {
  condition: string;
  recommendations: ProductRecommendations;
}

export interface LanguageOption {
  code: Language;
  label: string;
  country: Country;
  amazonDomain: string;
}