import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { analyzeSkinImage } from './gemini.ts'
import { getProductRecommendations } from './amazon.ts'
import { corsHeaders } from './cors.ts'

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
    
    // Parse request body
    const { image, language } = await req.json()
    console.log('Request received with language:', language)

    if (!image) {
      throw new Error('No image data provided')
    }

    // Validate image data format
    if (!image.startsWith('data:image') && !image.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)) {
      throw new Error('Invalid image data format')
    }

    console.log('Analyzing image...')
    const analysis = await analyzeSkinImage(image, language)
    
    console.log('Getting product recommendations...')
    const recommendations = await getProductRecommendations(analysis, language)

    const response = {
      condition: analysis,
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