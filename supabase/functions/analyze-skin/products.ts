export const productDatabase = {
  moisturizers: [
    {
      name: "CeraVe Moisturising Lotion",
      description: "Lightweight, oil-free moisturizer with 3 essential ceramides and hyaluronic acid",
      link: "https://amzn.to/4gjuUhU"
    },
    {
      name: "CeraVe Facial Moisturising Lotion",
      description: "Daily facial moisturizer with SPF protection and essential ceramides",
      link: "https://amzn.to/49GC11g"
    },
    {
      name: "Atoderm Intensive Gel-Creme",
      description: "Intensive moisturizing gel-cream for dry, sensitive skin",
      link: "https://amzn.to/4fECse5"
    },
    {
      name: "Neutrogena Hydro Boost Face Moisturizer",
      description: "Lightweight gel-cream moisturizer with hyaluronic acid",
      link: "https://amzn.to/4iIUeze"
    },
    {
      name: "Avene Cicalfate+",
      description: "Restorative protective cream for sensitive, irritated skin",
      link: "https://amzn.to/4gCS3vq"
    }
  ],
  cleansers: [
    {
      name: "CeraVe Hydrating Facial Cleanser",
      description: "Gentle, non-foaming cleanser with ceramides and hyaluronic acid",
      link: "https://amzn.to/3ZFWcYG"
    },
    {
      name: "Cetaphil Gentle Skin Cleanser",
      description: "Mild, non-irritating cleanser for all skin types",
      link: "https://amzn.to/3P0SL9W"
    },
    {
      name: "Paula's Choice CLEAR",
      description: "Pore normalizing cleanser for acne-prone skin",
      link: "https://amzn.to/3ZDjDBX"
    }
  ],
  exfoliants: [
    {
      name: "Paula's Choice SKIN PERFECTING 2% BHA",
      description: "Leave-on exfoliant with salicylic acid for unclogging pores",
      link: "https://amzn.to/3Dv7cjX"
    }
  ],
  sunscreens: [
    {
      name: "CeraVe Hydrating Mineral Sunscreen",
      description: "Broad-spectrum mineral sunscreen with ceramides",
      link: "https://amzn.to/4iEWyaE"
    },
    {
      name: "Bioré UV Biore Aqua Rich Watery Essence",
      description: "Lightweight, water-based sunscreen with SPF50+ PA++++",
      link: "https://amzn.to/3VJiIyI"
    },
    {
      name: "Neutrogena Face Sunscreen",
      description: "Oil-free daily facial sunscreen",
      link: "https://amzn.to/4flxlPz"
    },
    {
      name: "EltaMD UV Clear Face Sunscreen",
      description: "Oil-free facial sunscreen for sensitive and acne-prone skin",
      link: "https://amzn.to/3ZFDAba"
    },
    {
      name: "La Roche-Posay Anthelios",
      description: "Advanced sun protection with innovative technology",
      link: "https://amzn.to/4fqUgJt"
    }
  ],
  retinols: [
    {
      name: "Hyaluronic Acid 2%",
      description: "Multi-molecular hyaluronic acid formula for deep hydration",
      link: "https://amzn.to/3P3dDxo"
    },
    {
      name: "The Ordinary ORIGINAL Retinol 1%",
      description: "Pure retinol solution for targeting signs of aging",
      link: "https://amzn.to/4gBDSGU"
    },
    {
      name: "CeraVe Resurfacing RETINOL Serum",
      description: "Gentle retinol serum with ceramides for skin resurfacing",
      link: "https://amzn.to/4gb8grT"
    }
  ]
};

export type ProductCategory = keyof typeof productDatabase;