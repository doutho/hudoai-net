import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import { searchAmazonProducts } from "./amazon.ts";
import type { AnalysisResponse } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image data received');
    }

    // Extract base64 data
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;

    console.log('Analyzing image with Gemini API...');
    const analysisText = await analyzeSkinImage(base64Data);
    console.log('Analysis text:', analysisText);

    // Split the analysis into condition and product suggestions
    const [condition, productSuggestions] = analysisText.split('\n\n').filter(Boolean);

    // Extract product keywords from suggestions and search Amazon
    const productKeywords = productSuggestions
      .split('\n')
      .map(suggestion => suggestion.replace(/^\d+\.\s*/, ''))
      .map(suggestion => `skincare ${suggestion}`);

    console.log('Searching for products:', productKeywords);

    // Search Amazon for each product type
    const amazonProducts = await Promise.all(
      productKeywords.map(async (keyword) => {
        try {
          const items = await searchAmazonProducts(keyword);
          return items[0]; // Get the first (most relevant) product
        } catch (error) {
          console.error(`Error fetching Amazon product for ${keyword}:`, error);
          return null;
        }
      })
    );

    // Format the recommendations
    const recommendations = amazonProducts
      .filter(Boolean)
      .map(product => ({
        name: product?.ItemInfo?.Title?.DisplayValue || 'Product name not available',
        description: product?.ItemInfo?.Features?.DisplayValues?.[0] || 'Product description not available',
        link: product?.DetailPageURL || '#',
        image: product?.Images?.Primary?.Large?.URL || '',
        price: product?.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'Price not available'
      }));

    // Prepare the final response
    const finalResponse: AnalysisResponse = {
      condition: condition || 'Based on the image analysis, your skin appears healthy with some areas that could benefit from targeted care.',
      recommendations: recommendations.length > 0 ? recommendations : [
        {
          name: "CeraVe Hydrating Facial Cleanser",
          description: "Gentle, non-foaming cleanser for normal to dry skin",
          link: "https://www.amazon.com/dp/B01MSSDEPK",
          image: "https://m.media-amazon.com/images/I/71Sps9GKURL._SL1500_.jpg",
          price: "$15.99"
        },
        {
          name: "La Roche-Posay Effaclar Duo",
          description: "Dual action acne treatment with benzoyl peroxide",
          link: "https://www.amazon.com/dp/B00IRLMAOI",
          image: "https://m.media-amazon.com/images/I/61yTGqZGkIL._SL1500_.jpg",
          price: "$29.99"
        },
        {
          name: "The Ordinary Niacinamide 10% + Zinc 1%",
          description: "High-strength vitamin and mineral blemish formula",
          link: "https://www.amazon.com/dp/B06VW9L89J",
          image: "https://m.media-amazon.com/images/I/51INPbrnz+L._SL1000_.jpg",
          price: "$11.99"
        }
      ]
    };

    console.log('Sending response:', finalResponse);

    return new Response(
      JSON.stringify(finalResponse),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      }
    );
  }
});