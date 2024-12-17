import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import { productDatabase } from "./products.ts";
import type { AnalysisResponse } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getRandomProduct(category: keyof typeof productDatabase) {
  const products = productDatabase[category];
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}

function getProductRecommendations() {
  return {
    moisturizers: [getRandomProduct('moisturizers')],
    cleansers: [getRandomProduct('cleansers')],
    exfoliants: [getRandomProduct('exfoliants')],
    sunscreens: [getRandomProduct('sunscreens')],
    retinols: [getRandomProduct('retinols')]
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, language = 'en' } = await req.json();
    
    if (!image) {
      throw new Error('No image data provided');
    }

    console.log('Processing image analysis...');
    const base64Data = image.split('base64,')[1];
    
    console.log('Calling Gemini API...');
    const analysisText = await analyzeSkinImage(base64Data, language);
    
    if (!analysisText) {
      throw new Error('Failed to get analysis from Gemini API');
    }
    console.log('Gemini API response:', analysisText);

    console.log('Getting product recommendations...');
    const recommendations = getProductRecommendations();

    const response: AnalysisResponse = {
      condition: analysisText,
      recommendations
    };

    return new Response(JSON.stringify(response), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
