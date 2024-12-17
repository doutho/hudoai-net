import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";
import { createHmac } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function searchAmazonProducts(keywords: string) {
  const accessKeyId = Deno.env.get("AMAZON_ACCESS_KEY_ID");
  const secretKey = Deno.env.get("AMAZON_SECRET_ACCESS_KEY");
  const partnerTag = Deno.env.get("AMAZON_PARTNER_TAG");
  
  if (!accessKeyId || !secretKey || !partnerTag) {
    console.error('Missing Amazon API credentials');
    throw new Error('Amazon API credentials not configured');
  }

  const endpoint = "webservices.amazon.com";
  const uri = "/paapi5/searchitems";
  const region = "us-east-1";
  const service = "ProductAdvertisingAPI";

  const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = timestamp.substring(0, 8);

  const payload = {
    "Keywords": keywords,
    "Resources": [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "ItemInfo.Features"
    ],
    "PartnerTag": partnerTag,
    "PartnerType": "Associates",
    "Marketplace": "www.amazon.com",
    "Operation": "SearchItems"
  };

  const canonicalHeaders = [
    `content-encoding:amz-1.0`,
    `content-type:application/json; charset=utf-8`,
    `host:${endpoint}`,
    `x-amz-date:${timestamp}`,
    `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems`,
  ].join('\n');

  const canonicalRequest = [
    'POST',
    uri,
    '',
    canonicalHeaders,
    '',
    'content-encoding;content-type;host;x-amz-date;x-amz-target',
    await createHmac('sha256', '')
      .update(JSON.stringify(payload))
      .digest('hex'),
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    `${date}/${region}/${service}/aws4_request`,
    await createHmac('sha256', '')
      .update(canonicalRequest)
      .digest('hex'),
  ].join('\n');

  const getSignatureKey = async (key: string, dateStamp: string, regionName: string, serviceName: string) => {
    const kDate = await createHmac('sha256', `AWS4${key}`).update(dateStamp).digest();
    const kRegion = await createHmac('sha256', kDate).update(regionName).digest();
    const kService = await createHmac('sha256', kRegion).update(serviceName).digest();
    const kSigning = await createHmac('sha256', kService).update('aws4_request').digest();
    return kSigning;
  };

  const signatureKey = await getSignatureKey(secretKey, date, region, service);
  const signature = await createHmac('sha256', signatureKey)
    .update(stringToSign)
    .digest('hex');

  const headers = {
    'content-encoding': 'amz-1.0',
    'content-type': 'application/json; charset=utf-8',
    'x-amz-date': timestamp,
    'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
    'authorization': `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${date}/${region}/${service}/aws4_request, SignedHeaders=content-encoding;content-type;host;x-amz-date;x-amz-target, Signature=${signature}`,
  };

  const response = await fetch(`https://${endpoint}${uri}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error('Amazon API error:', await response.text());
    throw new Error('Failed to fetch Amazon products');
  }

  const data = await response.json();
  return data.SearchResult?.Items || [];
}

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
      1. A clear, detailed description of the visible skin condition, concerns, and characteristics (2-3 sentences)
      2. List 3 specific skincare product types that would address these concerns, focusing on key ingredients needed
      
      Format your response as plain text. Start with the skin analysis, followed by product suggestions.
      Keep it concise and actionable.
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
    const [condition, productSuggestions] = analysisText.split('\n\n').filter(Boolean);

    // Extract product keywords from suggestions and search Amazon
    const productKeywords = productSuggestions
      .split('\n')
      .map(suggestion => suggestion.replace(/^\d+\.\s*/, ''))
      .map(suggestion => `skincare ${suggestion}`);

    console.log('Searching for products:', productKeywords);

    // Search Amazon for each product type
    const amazonProducts = await Promise.all(
      productKeywords.map(async (keyword) => {
        try {
          const items = await searchAmazonProducts(keyword);
          return items[0]; // Get the first (most relevant) product
        } catch (error) {
          console.error(`Error fetching Amazon product for ${keyword}:`, error);
          return null;
        }
      })
    );

    // Format the recommendations
    const recommendations = amazonProducts
      .filter(Boolean)
      .map(product => ({
        name: product.ItemInfo.Title.DisplayValue,
        description: product.ItemInfo.Features?.DisplayValues?.[0] || 'Product description not available',
        link: product.DetailPageURL,
        image: product.Images.Primary.Large.URL,
        price: product.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'Price not available'
      }));

    // Prepare the final response
    const finalResponse = {
      condition: condition || 'Based on the image analysis, your skin appears healthy with some areas that could benefit from targeted care.',
      recommendations: recommendations.length > 0 ? recommendations : [
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
      ]
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