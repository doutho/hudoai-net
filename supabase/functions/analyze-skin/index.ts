import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import { productDatabase, findBestProductMatch } from "./products.ts";
import type { AnalysisResponse } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function parseGeminiResponse(response: string) {
  const parts = response.split(';').map(part => part.trim());
  const [
    skinType, skinTone, age, acne,
    moisturizerName, moisturizerDesc,
    cleanserName, cleanserDesc,
    exfoliantName, exfoliantDesc,
    sunscreenName, sunscreenDesc,
    retinolName, retinolDesc
  ] = parts;

  return {
    condition: `${skinType}; ${skinTone}; ${age}; ${acne}`,
    productDescriptions: {
      moisturizer: { name: moisturizerName, description: moisturizerDesc },
      cleanser: { name: cleanserName, description: cleanserDesc },
      exfoliant: { name: exfoliantName, description: exfoliantDesc },
      sunscreen: { name: sunscreenName, description: sunscreenDesc },
      retinol: { name: retinolName, description: retinolDesc }
    }
  };
}

function getProductRecommendations(condition: string, productDescriptions: any) {
  return {
    moisturizers: [
      {
        ...findBestProductMatch(productDatabase.moisturizers, condition),
        personalizedDescription: productDescriptions.moisturizer.description
      }
    ],
    cleansers: [
      {
        ...findBestProductMatch(productDatabase.cleansers, condition),
        personalizedDescription: productDescriptions.cleanser.description
      }
    ],
    exfoliants: [
      {
        ...findBestProductMatch(productDatabase.exfoliants, condition),
        personalizedDescription: productDescriptions.exfoliant.description
      }
    ],
    sunscreens: [
      {
        ...findBestProductMatch(productDatabase.sunscreens, condition),
        personalizedDescription: productDescriptions.sunscreen.description
      }
    ],
    retinols: [
      {
        ...findBestProductMatch(productDatabase.retinols, condition),
        personalizedDescription: productDescriptions.retinol.description
      }
    ]
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request to analyze-skin function');
    
    let body;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      body = JSON.parse(text);
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

    const { condition, productDescriptions } = parseGeminiResponse(analysisText);
    console.log('Getting product recommendations based on skin condition...');
    const recommendations = getProductRecommendations(condition, productDescriptions);

    const response: AnalysisResponse = {
      condition,
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