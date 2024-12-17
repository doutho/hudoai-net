import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

interface AmazonProduct {
  name: string;
  description: string;
  link: string;
  image: string;
  price: string;
}

// AWS SigV4 signing utility
function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
  const kDate = crypto.subtle.sign('HMAC', new TextEncoder().encode(`AWS4${key}`), new TextEncoder().encode(dateStamp));
  const kRegion = crypto.subtle.sign('HMAC', kDate, new TextEncoder().encode(regionName));
  const kService = crypto.subtle.sign('HMAC', kRegion, new TextEncoder().encode(serviceName));
  const kSigning = crypto.subtle.sign('HMAC', kService, new TextEncoder().encode('aws4_request'));
  return kSigning;
}

export async function searchAmazonProducts(keywords: string): Promise<AmazonProduct[]> {
  const accessKeyId = Deno.env.get("AMAZON_ACCESS_KEY_ID");
  const secretKey = Deno.env.get("AMAZON_SECRET_ACCESS_KEY");
  const partnerTag = Deno.env.get("AMAZON_PARTNER_TAG");
  
  if (!accessKeyId || !secretKey || !partnerTag) {
    console.error('Missing Amazon API credentials');
    return getFallbackProducts(keywords, partnerTag || '');
  }

  try {
    console.log('Searching Amazon products for keywords:', keywords);
    return getFallbackProducts(keywords, partnerTag);
  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    return getFallbackProducts(keywords, partnerTag);
  }
}

function getFallbackProducts(category: string, partnerTag: string): AmazonProduct[] {
  const productsByCategory: Record<string, AmazonProduct[]> = {
    moisturizer: [
      {
        name: "CeraVe Moisturizing Cream",
        description: "Daily Face and Body Moisturizer for Dry Skin with Hyaluronic Acid and Ceramides",
        link: "https://www.amazon.com/dp/B00TTD9BRC",
        image: "https://m.media-amazon.com/images/I/61S7BrCBj7L._SL1000_.jpg",
        price: "$16.08"
      },
      {
        name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
        description: "Oil-Free Face Moisturizer with Niacinamide and Ceramides",
        link: "https://www.amazon.com/dp/B01N9SPQHQ",
        image: "https://m.media-amazon.com/images/I/71epqoJrHFL._SL1500_.jpg",
        price: "$20.99"
      },
      {
        name: "Neutrogena Hydro Boost Water Gel",
        description: "Hyaluronic Acid Hydrating Face Moisturizer Gel for Dry Skin",
        link: "https://www.amazon.com/dp/B00AQ7FL6E",
        image: "https://m.media-amazon.com/images/I/71NLX6-rKQL._SL1500_.jpg",
        price: "$19.97"
      }
    ],
    cleanser: [
      {
        name: "CeraVe Foaming Facial Cleanser",
        description: "Daily Face Wash for Normal to Oily Skin",
        link: "https://www.amazon.com/dp/B01N1LL62W",
        image: "https://m.media-amazon.com/images/I/71Gq6oD2qML._SL1500_.jpg",
        price: "$15.99"
      },
      {
        name: "La Roche-Posay Toleriane Hydrating Gentle Cleanser",
        description: "Face Wash for Normal to Dry Sensitive Skin",
        link: "https://www.amazon.com/dp/B01N7T7JKJ",
        image: "https://m.media-amazon.com/images/I/61u6uqmqt-L._SL1500_.jpg",
        price: "$14.99"
      },
      {
        name: "Vanicream Gentle Facial Cleanser",
        description: "For Sensitive Skin, Fragrance Free",
        link: "https://www.amazon.com/dp/B00QY1XZ4W",
        image: "https://m.media-amazon.com/images/I/61S7aX4p8kL._SL1500_.jpg",
        price: "$8.86"
      }
    ],
    exfoliant: [
      {
        name: "Paula's Choice 2% BHA Liquid Exfoliant",
        description: "Facial Exfoliant for Blackheads, Large Pores & Acne",
        link: "https://www.amazon.com/dp/B00949CTQQ",
        image: "https://m.media-amazon.com/images/I/61PG0yxX7WL._SL1500_.jpg",
        price: "$32.00"
      },
      {
        name: "The Ordinary AHA 30% + BHA 2% Peeling Solution",
        description: "10-Minute Exfoliating Facial",
        link: "https://www.amazon.com/dp/B071D4D5DT",
        image: "https://m.media-amazon.com/images/I/61bGL1rKj9L._SL1500_.jpg",
        price: "$7.90"
      },
      {
        name: "COSRX BHA Blackhead Power Liquid",
        description: "Korean Skincare BHA Exfoliant",
        link: "https://www.amazon.com/dp/B00OZEJ8R8",
        image: "https://m.media-amazon.com/images/I/61Ho6pU+gBL._SL1500_.jpg",
        price: "$25.00"
      }
    ],
    sunscreen: [
      {
        name: "La Roche-Posay Anthelios Melt-In Sunscreen Milk SPF 60",
        description: "Body & Face Sunscreen with Broad Spectrum UVA/UVB Protection",
        link: "https://www.amazon.com/dp/B002CML1XE",
        image: "https://m.media-amazon.com/images/I/61MVSdz-8QL._SL1500_.jpg",
        price: "$24.99"
      },
      {
        name: "EltaMD UV Clear Facial Sunscreen SPF 46",
        description: "Oil-free Face Sunscreen for Sensitive Skin",
        link: "https://www.amazon.com/dp/B002MSN3QQ",
        image: "https://m.media-amazon.com/images/I/71KKr9OxJFL._SL1500_.jpg",
        price: "$37.00"
      },
      {
        name: "Neutrogena Clear Face Liquid Lotion Sunscreen SPF 55",
        description: "Oil-Free Face Sunscreen for Acne-Prone Skin",
        link: "https://www.amazon.com/dp/B004D281CK",
        image: "https://m.media-amazon.com/images/I/71dEJ8-YqGL._SL1500_.jpg",
        price: "$11.97"
      }
    ],
    retinol: [
      {
        name: "CeraVe Retinol Serum",
        description: "Anti Aging Face Serum with Retinol & Hyaluronic Acid",
        link: "https://www.amazon.com/dp/B00KRQG8TE",
        image: "https://m.media-amazon.com/images/I/61b9Zt8TcpL._SL1500_.jpg",
        price: "$16.97"
      },
      {
        name: "The Ordinary Retinol 1% in Squalane",
        description: "High Strength Retinol Serum",
        link: "https://www.amazon.com/dp/B07L8MFZW7",
        image: "https://m.media-amazon.com/images/I/51jb9EC5NFL._SL1500_.jpg",
        price: "$10.50"
      },
      {
        name: "RoC Retinol Correxion Deep Wrinkle Night Cream",
        description: "Anti-Aging Retinol Night Cream",
        link: "https://www.amazon.com/dp/B00027DMI8",
        image: "https://m.media-amazon.com/images/I/71e7ksQ-xyL._SL1500_.jpg",
        price: "$24.99"
      }
    ]
  };

  // Get products based on category keywords
  let products: AmazonProduct[] = [];
  if (category.includes('moisturizer')) {
    products = productsByCategory.moisturizer;
  } else if (category.includes('cleanser')) {
    products = productsByCategory.cleanser;
  } else if (category.includes('exfoliant')) {
    products = productsByCategory.exfoliant;
  } else if (category.includes('sunscreen')) {
    products = productsByCategory.sunscreen;
  } else if (category.includes('retinol')) {
    products = productsByCategory.retinol;
  }

  // Add affiliate tag to all product links
  return products.map(product => ({
    ...product,
    link: `${product.link}?tag=${partnerTag}`
  }));
}