import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import { productDatabase, findBestProductMatch } from "./products.ts";
import type { AnalysisResponse } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getProductRecommendations(condition: string) {
  return {
    moisturizers: [findBestProductMatch(productDatabase.moisturizers, condition)],
    cleansers: [findBestProductMatch(productDatabase.cleansers, condition)],
    exfoliants: [findBestProductMatch(productDatabase.exfoliants, condition)],
    sunscreens: [findBestProductMatch(productDatabase.sunscreens, condition)],
    retinols: [findBestProductMatch(productDatabase.retinols, condition)]
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
    
    console.log('Calling Gemini API...');
    const analysisText = await analyzeSkinImage(image, language);
    
    if (!analysisText) {
      throw new Error('Failed to get analysis from Gemini API');
    }
    console.log('Gemini API response:', analysisText);

    console.log('Getting product recommendations based on skin condition...');
    const recommendations = getProductRecommendations(analysisText);

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