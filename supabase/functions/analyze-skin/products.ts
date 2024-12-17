export const productDatabase = {
  moisturizers: [
    {
      name: "CeraVe Moisturizing Cream",
      description: "Rich, non-greasy moisturizer with ceramides and hyaluronic acid",
      link: "https://amzn.to/4iHMCxa"
    },
    {
      name: "La Roche-Posay Cicaplast Baume B5",
      description: "Soothing multi-purpose balm for dry, irritated skin",
      link: "https://amzn.to/4gjgQ85"
    },
    {
      name: "Neutrogena Hydro Boost Water Gel",
      description: "Lightweight gel moisturizer with hyaluronic acid",
      link: "https://amzn.to/4fqC1Uv"
    },
    {
      name: "Vanicream Moisturizing Cream",
      description: "Gentle, non-comedogenic moisturizer for sensitive skin",
      link: "https://amzn.to/3BKNdgJ"
    },
    {
      name: "First Aid Beauty Ultra Repair Cream",
      description: "Rich moisturizer for dry, distressed skin",
      link: "https://amzn.to/4gFEsDK"
    }
  ],
  cleansers: [
    {
      name: "CeraVe Hydrating Facial Cleanser",
      description: "Gentle, non-foaming cleanser with ceramides",
      link: "https://amzn.to/49ICVdG"
    },
    {
      name: "La Roche-Posay Toleriane Cleanser",
      description: "Gentle cleanser for sensitive skin",
      link: "https://amzn.to/41yfdPk"
    },
    {
      name: "Vanicream Gentle Facial Cleanser",
      description: "Non-irritating cleanser for sensitive skin",
      link: "https://amzn.to/3BpGmtc"
    }
  ],
  exfoliants: [
    {
      name: "Paula's Choice 2% BHA Liquid Exfoliant",
      description: "Gentle salicylic acid exfoliant for unclogging pores",
      link: "https://amzn.to/49GbroS"
    }
  ],
  sunscreens: [
    {
      name: "La Roche-Posay Anthelios Melt-In Sunscreen",
      description: "Lightweight, broad-spectrum SPF 60 protection",
      link: "https://amzn.to/4fqoLiq"
    },
    {
      name: "EltaMD UV Clear Facial Sunscreen",
      description: "Oil-free SPF 46 sunscreen for sensitive skin",
      link: "https://amzn.to/3ZXI667"
    },
    {
      name: "Neutrogena Invisible Daily Defense",
      description: "Lightweight SPF 60+ sunscreen for daily use",
      link: "https://amzn.to/41Fs4Pz"
    },
    {
      name: "Black Girl Sunscreen SPF 30",
      description: "No white cast, moisturizing sunscreen",
      link: "https://amzn.to/49GdvNE"
    }
  ],
  retinols: [
    {
      name: "CeraVe Resurfacing Retinol Serum",
      description: "Gentle retinol serum with niacinamide",
      link: "https://amzn.to/3ZD0HmR"
    },
    {
      name: "La Roche-Posay Retinol B3 Serum",
      description: "Pure retinol with vitamin B3 for visible aging",
      link: "https://amzn.to/4gw9IVK"
    },
    {
      name: "The Ordinary Retinol 1% in Squalane",
      description: "Stable retinol solution in squalane",
      link: "https://amzn.to/3DkjJGZ"
    }
  ]
};

export type ProductCategory = keyof typeof productDatabase;