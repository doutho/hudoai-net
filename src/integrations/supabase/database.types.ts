export interface AnalysisCounter {
  id: string;
  total_count: number | null;
  created_at: string | null;
}

export interface ProductRecommendation {
  id: string;
  user_id: string | null;
  product_asin: string | null;
  product_title: string | null;
  product_url: string | null;
  product_image: string | null;
  product_price: string | null;
  created_at: string | null;
}

export interface SkinQuizResponse {
  id: string;
  user_id: string | null;
  question_id: number | null;
  answer: string | null;
  created_at: string | null;
}