import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"
import { ProductAdvertisingAPIv1 } from "npm:amazon-paapi"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"))
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    // Analyze image with Gemini
    const prompt = `Analyze this skin image and provide:
    1. A brief description of the visible skin condition
    2. List 2-3 specific skincare product types that would help address these concerns
    Format the response as JSON with 'condition' and 'recommendations' fields.
    For recommendations, include product type and brief explanation why it would help.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image.split(',')[1]
        }
      }
    ])

    const response = result.response.text()
    let parsedResponse
    try {
      parsedResponse = JSON.parse(response)
    } catch {
      // If response isn't valid JSON, create a structured format
      parsedResponse = {
        condition: response.split('recommendations')[0],
        recommendations: response.split('recommendations:')[1]?.split(',') || []
      }
    }

    // Initialize Amazon PA API
    const amazonApi = new ProductAdvertisingAPIv1({
      accessKey: Deno.env.get("AMAZON_ACCESS_KEY_ID"),
      secretKey: Deno.env.get("AMAZON_SECRET_ACCESS_KEY"),
      partnerTag: Deno.env.get("AMAZON_PARTNER_TAG"),
      partnerType: "Associates",
      marketplace: "www.amazon.com",
    })

    // Search products for each recommendation
    const productPromises = parsedResponse.recommendations.map(async (rec: string) => {
      const searchParams = {
        Keywords: `skincare ${rec}`,
        SearchIndex: "Beauty",
        ItemCount: 1,
        Resources: [
          'ItemInfo.Title',
          'Offers.Listings.Price',
          'Images.Primary.Medium',
          'ItemInfo.Features',
          'ItemInfo.ProductInfo'
        ]
      }

      try {
        const response = await amazonApi.getItems(searchParams)
        if (response.ItemsResult?.Items?.[0]) {
          const item = response.ItemsResult.Items[0]
          return {
            name: item.ItemInfo.Title.DisplayValue,
            description: item.ItemInfo.Features?.DisplayValues?.[0] || "",
            link: item.DetailPageURL,
            image: item.Images.Primary.Medium.URL,
            price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || "Price not available"
          }
        }
        return null
      } catch (error) {
        console.error('Amazon API error:', error)
        return null
      }
    })

    const products = (await Promise.all(productPromises)).filter(p => p !== null)

    // Store recommendations in database
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2")
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('product_recommendations')
      .insert(products.map(product => ({
        product_title: product.name,
        product_url: product.link,
        product_image: product.image,
        product_price: product.price
      })))

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return new Response(
      JSON.stringify({
        condition: parsedResponse.condition,
        recommendations: products
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})