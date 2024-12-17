export const productDatabase = {
  moisturizers: [
    {
      name: "CeraVe Moisturizing Cream",
      description: "Rich, non-greasy moisturizer with 3 essential ceramides and hyaluronic acid",
      link: "https://amzn.to/4iHMCxa"
    },
    {
      name: "La Roche-Posay Cicaplast Baume B5",
      description: "Multi-purpose balm with panthenol and madecassoside for dry, irritated skin",
      link: "https://amzn.to/4gjgQ85"
    },
    {
      name: "Neutrogena Hydro Boost Water Gel",
      description: "Oil-free gel moisturizer with hyaluronic acid for instant hydration",
      link: "https://amzn.to/4fqC1Uv"
    },
    {
      name: "Vanicream Moisturizing Cream",
      description: "Gentle, non-comedogenic moisturizer ideal for sensitive skin",
      link: "https://amzn.to/3BKNdgJ"
    },
    {
      name: "First Aid Beauty Ultra Repair Cream",
      description: "Rich moisturizer with colloidal oatmeal for dry, distressed skin",
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
      name: "La Roche-Posay Toleriane Hydrating Cleanser",
      description: "Mild, creamy face wash for sensitive skin with niacinamide",
      link: "https://amzn.to/41yfdPk"
    },
    {
      name: "Vanicream Gentle Facial Cleanser",
      description: "Non-irritating, soap-free cleanser for sensitive skin",
      link: "https://amzn.to/3BpGmtc"
    }
  ],
  exfoliants: [
    {
      name: "Paula's Choice 2% BHA Liquid Exfoliant",
      description: "Leave-on exfoliant with salicylic acid for unclogging pores",
      link: "https://amzn.to/49GbroS"
    }
  ],
  sunscreens: [
    {
      name: "La Roche-Posay Anthelios Melt-In Sunscreen SPF 60",
      description: "Fast-absorbing, broad-spectrum protection with Cell-Ox Shield technology",
      link: "https://amzn.to/4fqoLiq"
    },
    {
      name: "EltaMD UV Clear Facial Sunscreen SPF 46",
      description: "Oil-free sunscreen with niacinamide, ideal for sensitive skin",
      link: "https://amzn.to/3ZXI667"
    },
    {
      name: "Neutrogena Invisible Daily Defense SPF 60+",
      description: "Lightweight, broad-spectrum protection for daily use",
      link: "https://amzn.to/41Fs4Pz"
    },
    {
      name: "Black Girl Sunscreen SPF 30",
      description: "No white cast, moisturizing sunscreen with natural ingredients",
      link: "https://amzn.to/49GdvNE"
    }
  ],
  retinols: [
    {
      name: "CeraVe Resurfacing Retinol Serum",
      description: "Gentle retinol serum with niacinamide and ceramides",
      link: "https://amzn.to/3ZD0HmR"
    },
    {
      name: "La Roche-Posay Retinol B3 Serum",
      description: "Pure retinol with vitamin B3 for visible signs of aging",
      link: "https://amzn.to/4gw9IVK"
    },
    {
      name: "The Ordinary Retinol 1% in Squalane",
      description: "Stable retinol solution in moisturizing squalane",
      link: "https://amzn.to/3DkjJGZ"
    }
  ]
};

export type ProductCategory = keyof typeof productDatabase;