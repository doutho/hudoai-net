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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to analyze-skin function');
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { image, language = 'en' } = body;
    
    if (!image) {
      console.error('No image data provided');
      return new Response(
        JSON.stringify({ error: 'No image data provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Processing image analysis...');
    // Extract base64 data after the comma if it includes the data URI scheme
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    
    console.log('Calling Gemini API...');
    const analysisText = await analyzeSkinImage(base64Data, language);
    
    if (!analysisText) {
      console.error('Failed to get analysis from Gemini API');
      return new Response(
        JSON.stringify({ error: 'Failed to analyze image' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    console.log('Gemini API response:', analysisText);

    console.log('Getting product recommendations based on skin condition...');
    const recommendations = getProductRecommendations(analysisText);

    const response: AnalysisResponse = {
      condition: analysisText,
      recommendations
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});