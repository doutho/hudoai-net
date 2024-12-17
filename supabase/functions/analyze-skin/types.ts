export type Language = 'en' | 'de' | 'sv';
export type Country = 'US' | 'DE' | 'UK' | 'SE';

export interface LanguageOption {
  code: Language;
  label: string;
  country: Country;
  amazonDomain: string;
}

export interface AnalysisResponse {
  condition: string;
  recommendations: Array<{
    name: string;
    description: string;
    link: string;
    image: string;
    price: string;
  }>;
}