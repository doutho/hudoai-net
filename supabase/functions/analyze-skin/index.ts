import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import type { AnalysisResponse, Language } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const defaultProducts = {
  moisturizers: [{
    name: "CeraVe Moisturizing Cream",
    description: "Daily Face and Body Moisturizer | Contains Hyaluronic Acid and Essential Ceramides for Deep Hydration",
    link: "https://www.amazon.com/dp/B00TTD9BRC?tag=skinai0d-20"
  }],
  cleansers: [{
    name: "La Roche-Posay Toleriane Hydrating Gentle Cleanser",
    description: "Daily Face Wash with Ceramides | Non-Irritating Formula for Sensitive Skin",
    link: "https://www.amazon.com/dp/B01N7T7JKJ?tag=skinai0d-20"
  }],
  exfoliants: [{
    name: "Paula's Choice 2% BHA Liquid Exfoliant",
    description: "Gentle Leave-On Exfoliator | Unclogs & Diminishes Enlarged Pores with Salicylic Acid",
    link: "https://www.amazon.com/dp/B00949CTQQ?tag=skinai0d-20"
  }],
  sunscreens: [{
    name: "EltaMD UV Clear Facial Sunscreen SPF 46",
    description: "Oil-Free Face Sunscreen | Broad Spectrum Protection for Sensitive & Acne-Prone Skin",
    link: "https://www.amazon.com/dp/B002MSN3QQ?tag=skinai0d-20"
  }],
  retinols: [{
    name: "The Ordinary Retinol 1% in Squalane",
    description: "Pure Retinol Anti-Aging Serum | Targets Fine Lines & Uneven Skin Tone",
    link: "https://www.amazon.com/dp/B07L8MFZW7?tag=skinai0d-20"
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

    // Ensure we have a valid response structure
    const response: AnalysisResponse = {
      condition: analysisText || "Unable to analyze skin condition",
      recommendations: defaultProducts
    };

    // Validate response structure before sending
    if (!response.condition || !response.recommendations) {
      throw new Error('Invalid response structure');
    }

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