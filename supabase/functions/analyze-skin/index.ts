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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this skin image and provide a detailed analysis in the following format:
      1. A clear, detailed description of the visible skin condition, concerns, and characteristics
      2. Suggest 3-4 specific skincare product types that would address these concerns
      
      Format your response as plain text, not JSON. Start with the skin analysis, followed by product suggestions.
      Do not include any JSON formatting or markdown syntax.
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
    const analysisText = response.text();
    
    console.log('Analysis text:', analysisText);

    // Split the analysis into condition and product suggestions
    const [condition, ...productSuggestions] = analysisText.split('\n\n').filter(Boolean);

    // Format mock product recommendations (in production, these would come from Amazon API)
    const mockRecommendations = [
      {
        name: "CeraVe Hydrating Facial Cleanser",
        description: "Gentle, non-foaming cleanser for normal to dry skin",
        link: "https://www.amazon.com/dp/B01MSSDEPK",
        image: "https://m.media-amazon.com/images/I/71Sps9GKURL._SL1500_.jpg",
        price: "$15.99"
      },
      {
        name: "La Roche-Posay Effaclar Duo",
        description: "Dual action acne treatment with benzoyl peroxide",
        link: "https://www.amazon.com/dp/B00IRLMAOI",
        image: "https://m.media-amazon.com/images/I/61yTGqZGkIL._SL1500_.jpg",
        price: "$29.99"
      },
      {
        name: "The Ordinary Niacinamide 10% + Zinc 1%",
        description: "High-strength vitamin and mineral blemish formula",
        link: "https://www.amazon.com/dp/B06VW9L89J",
        image: "https://m.media-amazon.com/images/I/51INPbrnz+L._SL1000_.jpg",
        price: "$11.99"
      }
    ];

    // Prepare the final response
    const finalResponse = {
      condition: condition || 'Based on the image analysis, your skin appears healthy with some areas that could benefit from targeted care.',
      recommendations: mockRecommendations
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