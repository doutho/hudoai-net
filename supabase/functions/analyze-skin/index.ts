import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import { searchAmazonProducts } from "./amazon.ts";
import type { AnalysisResponse, Language } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getProductRecommendations(condition: string) {
  console.log('Getting product recommendations for condition:', condition);
  
  try {
    const concerns = extractSkinConcerns(condition.toLowerCase());
    console.log('Extracted skin concerns:', concerns);

    const recommendations = {
      moisturizers: await searchAmazonProducts(`moisturizer for ${concerns.join(' ')} skin`),
      cleansers: await searchAmazonProducts(`cleanser for ${concerns.join(' ')} skin`),
      exfoliants: await searchAmazonProducts(`exfoliant for ${concerns.join(' ')} skin`),
      sunscreens: await searchAmazonProducts(`sunscreen for ${concerns.join(' ')} skin`),
      retinols: await searchAmazonProducts(`retinol for ${concerns.join(' ')} skin`),
      treatments: await searchAmazonProducts(`treatment for ${concerns.join(' ')} skin`)
    };

    console.log('Found recommendations:', recommendations);
    return recommendations;
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    throw new Error(`Failed to get product recommendations: ${error.message}`);
  }
}

function extractSkinConcerns(analysis: string): string[] {
  const concerns = new Set<string>();
  
  const conditionMap = {
    'acne': ['acne', 'pimples', 'breakouts'],
    'dry': ['dry', 'dehydrated', 'flaky'],
    'oily': ['oily', 'greasy'],
    'sensitive': ['sensitive', 'irritated'],
    'aging': ['aging', 'wrinkles', 'fine lines'],
    'hyperpigmentation': ['dark spots', 'hyperpigmentation', 'uneven tone'],
    'rosacea': ['rosacea', 'redness'],
    'combination': ['combination'],
  };

  for (const [condition, keywords] of Object.entries(conditionMap)) {
    if (keywords.some(keyword => analysis.includes(keyword))) {
      concerns.add(condition);
    }
  }

  if (concerns.size === 0) {
    concerns.add('normal');
  }

  return Array.from(concerns);
}

serve(async (req) => {
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

    const { image, language = 'en' } = await req.json();
    
    if (!image) {
      throw new Error('No image data received');
    }

    console.log('Processing image data...');
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    
    console.log('Calling Gemini API...');
    const analysisText = await analyzeSkinImage(base64Data, language as Language);
    
    if (!analysisText) {
      throw new Error('Failed to get analysis from Gemini API');
    }
    console.log('Gemini API response:', analysisText);

    console.log('Getting product recommendations...');
    const recommendations = await getProductRecommendations(analysisText);

    if (!recommendations) {
      throw new Error('Failed to get product recommendations');
    }

    const response: AnalysisResponse = {
      condition: analysisText,
      recommendations
    };

    console.log('Sending successful response');
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
    
    // Return a proper error response with CORS headers
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