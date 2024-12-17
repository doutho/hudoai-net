export const productDatabase = {
  moisturizers: [
    {
      asin: "4gjuUhU",
      name: "CeraVe Moisturising Lotion",
      description: "Hydrating moisturizer for dry to very dry skin",
      link: "https://amzn.to/4gjuUhU",
      image: "",
      price: "",
      conditions: ["dry", "very dry", "dehydrated"]
    },
    {
      asin: "49GC11g",
      name: "CeraVe Facial Moisturising Lotion",
      description: "Light moisturizer for normal to combination skin",
      link: "https://amzn.to/49GC11g",
      image: "",
      price: "",
      conditions: ["normal", "combination"]
    },
    {
      asin: "4fECse5",
      name: "Atoderm Intensive Gel-Creme",
      description: "Intensive moisturizer for sensitive skin",
      link: "https://amzn.to/4fECse5",
      image: "",
      price: "",
      conditions: ["sensitive", "irritated"]
    },
    {
      asin: "4iIUeze",
      name: "Neutrogena Hydro Boost Face Moisturizer",
      description: "Lightweight gel moisturizer for oily skin",
      link: "https://amzn.to/4iIUeze",
      image: "",
      price: "",
      conditions: ["oily", "combination"]
    },
    {
      asin: "4gCS3vq",
      name: "Avene Cicalfate+",
      description: "Restorative moisturizer for damaged skin",
      link: "https://amzn.to/4gCS3vq",
      image: "",
      price: "",
      conditions: ["damaged", "irritated", "sensitive"]
    }
  ],
  cleansers: [
    {
      asin: "3ZFWcYG",
      name: "CeraVe Hydrating Facial Cleanser",
      description: "Gentle cleanser for dry to normal skin",
      link: "https://amzn.to/3ZFWcYG",
      image: "",
      price: "",
      conditions: ["dry", "normal", "sensitive"]
    },
    {
      asin: "3P0SL9W",
      name: "Cetaphil Gentle Skin Cleanser",
      description: "Mild cleanser for sensitive skin",
      link: "https://amzn.to/3P0SL9W",
      image: "",
      price: "",
      conditions: ["sensitive", "dry"]
    },
    {
      asin: "3ZDjDBX",
      name: "Paula's Choice CLEAR",
      description: "Pore-clearing cleanser for oily and acne-prone skin",
      link: "https://amzn.to/3ZDjDBX",
      image: "",
      price: "",
      conditions: ["oily", "acne-prone"]
    }
  ],
  exfoliants: [
    {
      asin: "3Dv7cjX",
      name: "Paula's Choice SKIN PERFECTING 2% BHA",
      description: "Gentle exfoliant for all skin types",
      link: "https://amzn.to/3Dv7cjX",
      image: "",
      price: "",
      conditions: ["all", "oily", "combination", "normal"]
    }
  ],
  sunscreens: [
    {
      asin: "4iEWyaE",
      name: "CeraVe Hydrating Mineral Sunscreen",
      description: "Mineral sunscreen for sensitive skin",
      link: "https://amzn.to/4iEWyaE",
      image: "",
      price: "",
      conditions: ["sensitive", "dry"]
    },
    {
      asin: "3VJiIyI",
      name: "Bioré UV Biore Aqua Rich Watery Essence",
      description: "Lightweight sunscreen for oily skin",
      link: "https://amzn.to/3VJiIyI",
      image: "",
      price: "",
      conditions: ["oily", "combination"]
    },
    {
      asin: "4flxlPz",
      name: "Neutrogena Face Sunscreen",
      description: "Daily sunscreen for normal skin",
      link: "https://amzn.to/4flxlPz",
      image: "",
      price: "",
      conditions: ["normal", "combination"]
    },
    {
      asin: "3ZFDAba",
      name: "EltaMD UV Clear Face Sunscreen",
      description: "Non-comedogenic sunscreen for acne-prone skin",
      link: "https://amzn.to/3ZFDAba",
      image: "",
      price: "",
      conditions: ["acne-prone", "sensitive"]
    },
    {
      asin: "4fqUgJt",
      name: "La Roche-Posay Anthelios",
      description: "High protection sunscreen for all skin types",
      link: "https://amzn.to/4fqUgJt",
      image: "",
      price: "",
      conditions: ["all"]
    }
  ],
  retinols: [
    {
      asin: "3P3dDxo",
      name: "Hyaluronic Acid 2%",
      description: "Hydrating serum for all skin types",
      link: "https://amzn.to/3P3dDxo",
      image: "",
      price: "",
      conditions: ["all", "dehydrated"]
    },
    {
      asin: "4gBDSGU",
      name: "The Ordinary ORIGINAL Retinol 1%",
      description: "Strong retinol for experienced users",
      link: "https://amzn.to/4gBDSGU",
      image: "",
      price: "",
      conditions: ["aging", "mature"]
    },
    {
      asin: "4gb8grT",
      name: "CeraVe Resurfacing RETINOL Serum",
      description: "Gentle retinol for beginners",
      link: "https://amzn.to/4gb8grT",
      image: "",
      price: "",
      conditions: ["sensitive", "normal"]
    }
  ]
};

// Helper function to find the best product match based on skin condition
export const findBestProductMatch = (products: any[], condition: string): any => {
  // Convert condition to lowercase and split into keywords
  const conditionKeywords = condition.toLowerCase().split(/[,\s]+/);
  
  // Score each product based on how many condition matches it has
  const scoredProducts = products.map(product => {
    const score = product.conditions.reduce((acc: number, productCondition: string) => {
      if (conditionKeywords.some(keyword => 
          productCondition.toLowerCase().includes(keyword) || 
          keyword.includes(productCondition.toLowerCase()))) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return { ...product, score };
  });

  // Sort by score and return the best match
  // If no matches found, return the first product with "all" condition or the first product
  const bestMatch = scoredProducts.sort((a, b) => b.score - a.score)[0];
  if (bestMatch.score === 0) {
    return products.find(p => p.conditions.includes("all")) || products[0];
  }
  return bestMatch;
};