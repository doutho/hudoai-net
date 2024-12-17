export const productDatabase = {
  moisturizers: [
    {
      name: "CeraVe Moisturising Lotion",
      description: "Lightweight, oil-free moisturizer with 3 essential ceramides and hyaluronic acid",
      link: "https://amzn.to/4iHMCxa"
    },
    {
      name: "CeraVe Facial Moisturising Lotion",
      description: "Daily facial moisturizer with SPF protection and essential ceramides",
      link: "https://amzn.to/4gjgQ85"
    },
    {
      name: "Atoderm Intensive Gel-Creme",
      description: "Intensive moisturizing gel-cream for dry, sensitive skin",
      link: "https://amzn.to/4fqC1Uv"
    },
    {
      name: "CLINIQUE Moisture Surge",
      description: "72-hour auto-replenishing hydrator for all skin types",
      link: "https://amzn.to/3BKNdgJ"
    },
    {
      name: "Avene Cicalfate+",
      description: "Restorative protective cream for sensitive, irritated skin",
      link: "https://amzn.to/4gFEsDK"
    }
  ],
  cleansers: [
    {
      name: "CeraVe Hydrating Facial Cleanser",
      description: "Gentle, non-foaming cleanser with ceramides and hyaluronic acid",
      link: "https://amzn.to/49ICVdG"
    },
    {
      name: "Cetaphil Gentle Skin Cleanser",
      description: "Mild, non-irritating cleanser for all skin types",
      link: "https://amzn.to/41yfdPk"
    },
    {
      name: "Paula's Choice CLEAR",
      description: "Pore normalizing cleanser for acne-prone skin",
      link: "https://amzn.to/3BpGmtc"
    }
  ],
  exfoliants: [
    {
      name: "Paula's Choice SKIN PERFECTING 2% BHA",
      description: "Leave-on exfoliant with salicylic acid for unclogging pores",
      link: "https://amzn.to/49GbroS"
    }
  ],
  sunscreens: [
    {
      name: "La Roche-Posay Anthelios",
      description: "Broad spectrum SPF protection with advanced UVA/UVB filters",
      link: "https://amzn.to/4fqoLiq"
    },
    {
      name: "Bioré UV Biore Aqua Rich Watery Essence",
      description: "Lightweight, water-based sunscreen with SPF50+ PA++++",
      link: "https://amzn.to/3ZXI667"
    },
    {
      name: "La Roche-Posay Anthelios UVmune",
      description: "Advanced sun protection with innovative UVmune technology",
      link: "https://amzn.to/41Fs4Pz"
    },
    {
      name: "Missha Sun Milk",
      description: "Lightweight, fast-absorbing sunscreen with broad spectrum protection",
      link: "https://amzn.to/49GdvNE"
    }
  ],
  retinols: [
    {
      name: "The Ordinary Hyaluronic Acid 2%",
      description: "Multi-molecular hyaluronic acid formula for deep hydration",
      link: "https://amzn.to/3ZD0HmR"
    },
    {
      name: "The Ordinary ORIGINAL Retinol 1%",
      description: "Pure retinol solution for targeting signs of aging",
      link: "https://amzn.to/4gw9IVK"
    },
    {
      name: "CeraVe Resurfacing RETINOL Serum",
      description: "Gentle retinol serum with ceramides for skin resurfacing",
      link: "https://amzn.to/3DkjJGZ"
    }
  ]
};

export type ProductCategory = keyof typeof productDatabase;