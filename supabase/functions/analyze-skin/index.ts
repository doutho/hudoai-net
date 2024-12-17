import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import { searchAmazonProducts } from "./amazon.ts";
import type { AnalysisResponse, Language } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
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

    const { image, language = 'en' } = await req.json();
    
    if (!image) {
      throw new Error('No image data received');
    }

    console.log('Processing image data...');
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    
    console.log('Calling Gemini API...');
    const analysisText = await analyzeSkinImage(base64Data, language as Language);
    console.log('Gemini API response:', analysisText);

    // Extract product types from recommendations
    const productTypes = analysisText
      .split('\n')
      .filter(line => line.includes('**'))
      .map(line => {
        const match = line.match(/\*\*(.*?)\*\*:\s*(.*)/);
        return match ? `skincare ${match[1]} ${match[2]}` : null;
      })
      .filter(Boolean);

    console.log('Searching for products:', productTypes);

    // Search Amazon for each product type
    const productPromises = productTypes.slice(0, 4).map(async (searchTerm) => {
      try {
        const items = await searchAmazonProducts(searchTerm);
        return items[0]; // Get the first (most relevant) product
      } catch (error) {
        console.error(`Error fetching Amazon product for ${searchTerm}:`, error);
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
      condition: analysisText,
      recommendations: recommendations.length > 0 ? recommendations : [
        {
          name: "CeraVe Hydrating Facial Cleanser",
          description: "Gentle, non-foaming cleanser for normal to dry skin",
          link: "https://www.amazon.com/dp/B01MSSDEPK",
          image: "https://m.media-amazon.com/images/I/71Sps9GKURL._SL1500_.jpg",
          price: "$15.99"
        },
        {
          name: "La Roche-Posay Double Repair Face Moisturizer",
          description: "Daily moisturizer with ceramides and niacinamide",
          link: "https://www.amazon.com/dp/B01N9SPQHQ",
          image: "https://m.media-amazon.com/images/I/71nqr8t36BL._SL1500_.jpg",
          price: "$19.99"
        },
        {
          name: "Paula's Choice 2% BHA Liquid Exfoliant",
          description: "Gentle leave-on exfoliant for unclogging pores",
          link: "https://www.amazon.com/dp/B00949CTQQ",
          image: "https://m.media-amazon.com/images/I/61d6JpHiuVL._SL1500_.jpg",
          price: "$32.00"
        },
        {
          name: "EltaMD UV Clear Facial Sunscreen SPF 46",
          description: "Oil-free sunscreen for sensitive and acne-prone skin",
          link: "https://www.amazon.com/dp/B002MSN3QQ",
          image: "https://m.media-amazon.com/images/I/71KaWB+hJvL._SL1500_.jpg",
          price: "$39.00"
        }
      ]
    };

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
