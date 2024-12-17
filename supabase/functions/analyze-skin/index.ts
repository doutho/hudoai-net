import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeSkinImage } from "./gemini.ts";
import { searchAmazonProducts } from "./amazon.ts";
import type { AnalysisResponse } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getProductRecommendations(condition: string) {
  console.log('Getting product recommendations for condition:', condition);
  
  try {
    const concerns = extractSkinConcerns(condition.toLowerCase());
    console.log('Extracted skin concerns:', concerns);

    // Get one product per category based on the skin concerns
    const [moisturizer] = await searchAmazonProducts(`moisturizer for ${concerns.join(' ')} skin`);
    const [cleanser] = await searchAmazonProducts(`cleanser for ${concerns.join(' ')} skin`);
    const [exfoliant] = await searchAmazonProducts(`exfoliant for ${concerns.join(' ')} skin`);
    const [sunscreen] = await searchAmazonProducts(`sunscreen for ${concerns.join(' ')} skin`);
    const [retinol] = await searchAmazonProducts(`retinol for ${concerns.join(' ')} skin`);

    // Replace placeholders in the analysis text with actual product recommendations
    let analysisText = condition;
    if (moisturizer) {
      analysisText = analysisText.replace('[MOISTURIZER]', `${moisturizer.name} (${moisturizer.description})`);
    }
    if (cleanser) {
      analysisText = analysisText.replace('[CLEANSER]', `${cleanser.name} (${cleanser.description})`);
    }
    if (exfoliant) {
      analysisText = analysisText.replace('[EXFOLIANT]', `${exfoliant.name} (${exfoliant.description})`);
    }
    if (sunscreen) {
      analysisText = analysisText.replace('[SUNSCREEN]', `${sunscreen.name} (${sunscreen.description})`);
    }
    if (retinol) {
      analysisText = analysisText.replace('[RETINOL]', `${retinol.name} (${retinol.description})`);
    }

    return {
      moisturizers: moisturizer ? [moisturizer] : [],
      cleansers: cleanser ? [cleanser] : [],
      exfoliants: exfoliant ? [exfoliant] : [],
      sunscreens: sunscreen ? [sunscreen] : [],
      retinols: retinol ? [retinol] : []
    };
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    throw new Error(`Failed to get product recommendations: ${error.message}`);
  }
}

function extractSkinConcerns(analysis: string): string[] {
  const concerns = new Set<string>();
  
  const conditionMap = {
    'acne': ['acne', 'pimples', 'breakouts', 'oily'],
    'dry': ['dry', 'dehydrated', 'flaky'],
    'sensitive': ['sensitive', 'irritated', 'redness'],
    'aging': ['aging', 'wrinkles', 'fine lines'],
    'hyperpigmentation': ['dark spots', 'hyperpigmentation', 'uneven'],
    'combination': ['combination', 'mixed'],
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
    const recommendations = await getProductRecommendations(analysisText);

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