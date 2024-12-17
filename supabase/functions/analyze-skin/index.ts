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

const defaultProducts = {
  moisturizers: [{
    name: "CeraVe Moisturizing Cream",
    description: "Daily Face and Body Moisturizer for Dry Skin",
    link: "https://www.amazon.com/dp/B00TTD9BRC"
  }],
  cleansers: [{
    name: "La Roche-Posay Toleriane",
    description: "Gentle Hydrating Facial Cleanser",
    link: "https://www.amazon.com/dp/B01N7T7JKJ"
  }],
  exfoliants: [{
    name: "Paula's Choice 2% BHA",
    description: "Liquid Salicylic Acid Exfoliant",
    link: "https://www.amazon.com/dp/B00949CTQQ"
  }],
  sunscreens: [{
    name: "EltaMD UV Clear",
    description: "Facial Sunscreen Broad-Spectrum SPF 46",
    link: "https://www.amazon.com/dp/B002MSN3QQ"
  }],
  retinols: [{
    name: "The Ordinary Retinol 1%",
    description: "Pure Retinol Anti-Aging Serum",
    link: "https://www.amazon.com/dp/B07L8MFZW7"
  }]
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

    const response: AnalysisResponse = {
      condition: analysisText,
      recommendations: defaultProducts
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));

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