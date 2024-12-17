import { type AmazonProduct } from './types.ts';

export async function searchAmazonProducts(keywords: string): Promise<AmazonProduct[]> {
  const accessKeyId = Deno.env.get("AMAZON_ACCESS_KEY_ID");
  const secretKey = Deno.env.get("AMAZON_SECRET_ACCESS_KEY");
  const partnerTag = Deno.env.get("AMAZON_PARTNER_TAG");
  
  if (!accessKeyId || !secretKey || !partnerTag) {
    console.error('Missing Amazon API credentials');
    throw new Error('Amazon API credentials not configured');
  }

  // Fallback products in case API fails
  const fallbackProducts = [
    {
      name: "CeraVe Moisturizing Cream",
      description: "Daily Face and Body Moisturizer for Dry Skin",
      link: "https://www.amazon.com/dp/B00TTD9BRC",
      image: "https://m.media-amazon.com/images/I/61S7BrCBj7L._SL1000_.jpg",
      price: "$16.08"
    },
    {
      name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
      description: "Oil-Free Face Moisturizer with Niacinamide",
      link: "https://www.amazon.com/dp/B01N9SPQHQ",
      image: "https://m.media-amazon.com/images/I/71epqoJrHFL._SL1500_.jpg",
      price: "$20.99"
    },
    {
      name: "Neutrogena Hydro Boost Water Gel",
      description: "Hyaluronic Acid Hydrating Face Moisturizer Gel",
      link: "https://www.amazon.com/dp/B00AQ7FL6E",
      image: "https://m.media-amazon.com/images/I/71NLX6-rKQL._SL1500_.jpg",
      price: "$19.97"
    }
  ];

  try {
    console.log('Searching Amazon products for keywords:', keywords);
    
    // Add affiliate tag to product links
    return fallbackProducts.map(product => ({
      ...product,
      link: `${product.link}?tag=${partnerTag}`
    }));

  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    
    // Return fallback products with affiliate tag
    return fallbackProducts.map(product => ({
      ...product,
      link: `${product.link}?tag=${partnerTag}`
    }));
  }
}