export interface AmazonProduct {
  ItemInfo?: {
    Title?: {
      DisplayValue?: string;
    };
    Features?: {
      DisplayValues?: string[];
    };
  };
  DetailPageURL?: string;
  Images?: {
    Primary?: {
      Large?: {
        URL?: string;
      };
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        DisplayAmount?: string;
      };
    }>;
  };
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