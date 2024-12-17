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
    // Extract key skin concerns from the analysis
    const concerns = extractSkinConcerns(condition.toLowerCase());
    console.log('Extracted skin concerns:', concerns);

    // Search for products based on concerns
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
    throw error;
  }
}

function extractSkinConcerns(analysis: string): string[] {
  const concerns = new Set<string>();
  
  // Common skin conditions to look for
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

  // Check for each condition in the analysis
  for (const [condition, keywords] of Object.entries(conditionMap)) {
    if (keywords.some(keyword => analysis.includes(keyword))) {
      concerns.add(condition);
    }
  }

  // If no specific concerns found, default to 'normal'
  if (concerns.size === 0) {
    concerns.add('normal');
  }

  return Array.from(concerns);
}

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

    // Get personalized product recommendations based on the analysis
    console.log('Getting product recommendations...');
    const recommendations = await getProductRecommendations(analysisText);

    // Create response
    const response: AnalysisResponse = {
      condition: analysisText,
      recommendations
    };

    console.log('Final response structure:', JSON.stringify(response, null, 2));

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