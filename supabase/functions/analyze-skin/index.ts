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
  moisturizers: [
    {
      name: "CeraVe Moisturizing Cream",
      description: "Daily face and body moisturizer for dry skin with hyaluronic acid and ceramides",
      link: "https://www.amazon.com/dp/B00TTD9BRC"
    },
    {
      name: "La Roche-Posay Double Repair Face Moisturizer",
      description: "Daily moisturizer with ceramides and niacinamide",
      link: "https://www.amazon.com/dp/B01N9SPQHQ"
    },
    {
      name: "Neutrogena Hydro Boost Water Gel",
      description: "Lightweight gel moisturizer with hyaluronic acid",
      link: "https://www.amazon.com/dp/B00AQ7FL6E"
    }
  ],
  cleansers: [
    {
      name: "CeraVe Hydrating Facial Cleanser",
      description: "Gentle, non-foaming cleanser for normal to dry skin",
      link: "https://www.amazon.com/dp/B01MSSDEPK"
    },
    {
      name: "La Roche-Posay Toleriane Hydrating Gentle Cleanser",
      description: "Daily face wash for sensitive skin",
      link: "https://www.amazon.com/dp/B01N7T7JKJ"
    },
    {
      name: "Vanicream Gentle Facial Cleanser",
      description: "Non-comedogenic cleanser for sensitive skin",
      link: "https://www.amazon.com/dp/B00QY1XZ4W"
    }
  ],
  exfoliants: [
    {
      name: "Paula's Choice 2% BHA Liquid Exfoliant",
      description: "Gentle leave-on exfoliant for unclogging pores",
      link: "https://www.amazon.com/dp/B00949CTQQ"
    },
    {
      name: "The Ordinary Lactic Acid 5% + HA",
      description: "Mild exfoliating serum for sensitive skin",
      link: "https://www.amazon.com/dp/B071Z5C37J"
    },
    {
      name: "CosRx BHA Blackhead Power Liquid",
      description: "Gentle BHA treatment for blackheads and enlarged pores",
      link: "https://www.amazon.com/dp/B00OZEJ8R8"
    }
  ],
  sunscreens: [
    {
      name: "EltaMD UV Clear Facial Sunscreen SPF 46",
      description: "Oil-free sunscreen for sensitive and acne-prone skin",
      link: "https://www.amazon.com/dp/B002MSN3QQ"
    },
    {
      name: "La Roche-Posay Anthelios Melt-In Sunscreen SPF 60",
      description: "Fast-absorbing sunscreen for face and body",
      link: "https://www.amazon.com/dp/B002CML1XE"
    },
    {
      name: "Supergoop! Play Everyday Lotion SPF 50",
      description: "Lightweight, everyday sunscreen for all skin types",
      link: "https://www.amazon.com/dp/B08P5F28G9"
    }
  ],
  retinols: [
    {
      name: "CeraVe Resurfacing Retinol Serum",
      description: "Gentle retinol serum for post-acne marks",
      link: "https://www.amazon.com/dp/B07VWSN95S"
    },
    {
      name: "The Ordinary Retinol 0.5% in Squalane",
      description: "Moderate-strength retinol for anti-aging",
      link: "https://www.amazon.com/dp/B07L8MFZW7"
    },
    {
      name: "La Roche-Posay Retinol B3 Serum",
      description: "Pure retinol with vitamin B3 for visible aging",
      link: "https://www.amazon.com/dp/B07L8MFZW7"
    }
  ]
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