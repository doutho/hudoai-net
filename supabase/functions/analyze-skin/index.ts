import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import { searchAmazonProducts } from "./amazon.ts";
import type { AnalysisResponse } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log('Received request:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image data received');
    }

    console.log('Processing image data...');

    // Extract base64 data
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    
    // Analyze image with Gemini
    console.log('Calling Gemini API...');
    const analysisText = await analyzeSkinImage(base64Data);
    console.log('Gemini API response:', analysisText);

    // Parse analysis text to extract product recommendations
    const [condition, recommendationsText] = analysisText.split('\n\n');
    
    // Extract product types from recommendations
    const productTypes = recommendationsText
      .split('\n')
      .filter(line => line.startsWith('-'))
      .map(line => line.replace(/^-\s*([^:]+):.*$/, '$1').trim());

    console.log('Searching for products:', productTypes);

    // Search Amazon for each product type
    const productPromises = productTypes.map(async (productType) => {
      try {
        const searchTerm = `skincare ${productType}`;
        const items = await searchAmazonProducts(searchTerm);
        return items[0]; // Get the first (most relevant) product
      } catch (error) {
        console.error(`Error fetching Amazon product for ${productType}:`, error);
        return null;
      }
    });

    const amazonProducts = await Promise.all(productPromises);

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

    const response: AnalysisResponse = {
      condition: condition || 'Analysis not available',
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
        }
      ]
    };

    console.log('Sending response:', response);

    return new Response(
      JSON.stringify(response),
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
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.stack || 'No stack trace available'
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: error.message === 'Method not allowed' ? 405 : 500
      }
    );
  }
});