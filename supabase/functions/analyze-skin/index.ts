import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image data received');
    }

    // Extract base64 data
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;

    console.log('Initializing Gemini API');
    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = `
      Analyze this skin image and provide:
      1. A brief description of the skin condition
      2. Recommended skincare products that would help
      Format the response as JSON with 'condition' and 'recommendations' fields.
      For recommendations, include product name, description, and Amazon link.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);

    console.log('Received response from Gemini');
    const response = await result.response;
    const text = response.text();

    // Parse the response and format recommendations
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (e) {
      console.error('Error parsing Gemini response:', e);
      // If parsing fails, create a structured response from the text
      parsedResponse = {
        condition: text.split('\n')[0],
        recommendations: []
      };
    }

    // Ensure recommendations are properly formatted
    const formattedRecommendations = (parsedResponse.recommendations || []).map((rec: any) => ({
      name: rec.name || rec.product || 'Recommended Product',
      description: rec.description || 'Product description not available',
      link: rec.link || rec.url || 'https://www.amazon.com',
      image: rec.image || 'https://via.placeholder.com/150',
      price: rec.price || 'Price not available'
    }));

    // Prepare the final response
    const finalResponse = {
      condition: parsedResponse.condition || 'Skin analysis completed',
      recommendations: formattedRecommendations
    };

    console.log('Sending response:', finalResponse);

    return new Response(
      JSON.stringify(finalResponse),
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      }
    );
  }
});