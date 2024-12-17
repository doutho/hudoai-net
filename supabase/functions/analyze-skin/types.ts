export type Language = 'en' | 'de' | 'sv';
export type Country = 'US' | 'DE' | 'UK' | 'SE';

export interface LanguageOption {
  code: Language;
  label: string;
  country: Country;
  amazonDomain: string;
}

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

export interface AmazonProduct {
  ASIN: string;
  DetailPageURL: string;
  ItemInfo: {
    Title: {
      DisplayValue: string;
    };
    Features?: {
      DisplayValues: string[];
    };
  };
}