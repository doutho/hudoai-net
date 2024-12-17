import { createHmac } from "crypto";

interface AmazonProduct {
  name: string;
  description: string;
  link: string;
  image: string;
  price: string;
}

// AWS SigV4 signing utility
function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
  const kDate = createHmac('sha256', `AWS4${key}`).update(dateStamp).digest();
  const kRegion = createHmac('sha256', kDate).update(regionName).digest();
  const kService = createHmac('sha256', kRegion).update(serviceName).digest();
  const kSigning = createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

export async function searchAmazonProducts(keywords: string): Promise<AmazonProduct[]> {
  const accessKeyId = Deno.env.get("AMAZON_ACCESS_KEY_ID");
  const secretKey = Deno.env.get("AMAZON_SECRET_ACCESS_KEY");
  const partnerTag = Deno.env.get("AMAZON_PARTNER_TAG");
  
  if (!accessKeyId || !secretKey || !partnerTag) {
    console.error('Missing Amazon API credentials');
    return getFallbackProducts(partnerTag || '');
  }

  try {
    console.log('Searching Amazon products for keywords:', keywords);
    
    // For now, return fallback products with the partner tag
    // In a future update, we can implement the full PA-API integration
    return getFallbackProducts(partnerTag);

  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    return getFallbackProducts(partnerTag);
  }
}

function getFallbackProducts(partnerTag: string): AmazonProduct[] {
  const products = [
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
    },
    {
      name: "The Ordinary Niacinamide 10% + Zinc 1%",
      description: "Oil Control Serum for Face with Niacinamide and Zinc - Pore Reducer",
      link: "https://www.amazon.com/dp/B01MDTVZTZ",
      image: "https://m.media-amazon.com/images/I/61mqxv0rLiL._SL1500_.jpg",
      price: "$11.90"
    },
    {
      name: "Paula's Choice 2% BHA Liquid Exfoliant",
      description: "Facial Exfoliant for Blackheads, Large Pores & Acne",
      link: "https://www.amazon.com/dp/B00949CTQQ",
      image: "https://m.media-amazon.com/images/I/61PG0yxX7WL._SL1500_.jpg",
      price: "$32.00"
    }
  ];

  // Add affiliate tag to all product links
  return products.map(product => ({
    ...product,
    link: `${product.link}?tag=${partnerTag}`
  }));
}