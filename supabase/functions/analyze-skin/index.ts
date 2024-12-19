import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { analyzeSkinImage } from './gemini.ts'
import { getProductRecommendations } from './amazon.ts'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log("Hello from analyze-skin function!")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    console.log('Received request:', req.method)
    const { image, language } = await req.json()

    if (!image) {
      throw new Error('No image data provided')
    }

    console.log('Analyzing image...')
    const analysis = await analyzeSkinImage(image)
    
    console.log('Getting product recommendations...')
    const recommendations = await getProductRecommendations(analysis, language)

    const response = {
      condition: analysis.condition,
      recommendations
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error in analyze-skin function:', error)
    
    return new Response(
      JSON.stringify({
        error: `Failed to analyze image: ${error.message}`,
        details: error.stack
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})