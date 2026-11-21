// ONE FILE TO CUSTOMISE THE WHOLE SITE. Replace these demo values for a real showroom.
export const showroom = {
  name: "VELOCITY MOTORS",
  tagline: "Find Your Ride. Own Your Road.",
  logoText: "VELOCITY",          // text logo; swap for an <img> in components/Layout.tsx if you have a logo file
  phone: "+91 98765 43210",       // DEMO placeholder
  whatsapp: "919876543210",       // digits only, with country code. DEMO placeholder
  email: "hello@example.com",     // DEMO placeholder
  address: "Showroom address placeholder, Pune, Maharashtra, India",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pune%2C+Maharashtra",
  mapEmbed: "https://www.google.com/maps?q=Pune%2C+Maharashtra&output=embed",
  social: { instagram: "https://instagram.com/", facebook: "https://facebook.com/", youtube: "https://youtube.com/" },
  hours: [["Monday to Saturday", "10:00 am to 8:00 pm (placeholder)"], ["Sunday", "10:00 am to 6:00 pm (placeholder)"]],
  showDemoBadge: true,
  hero: {
    line1: "Your next ride", line2: "starts here.",
    sub: "Explore machines built for every road, every ambition, every rider.",
    featuredBikeId: "yamaha-r15-v4"
  },
  offerNote: "Offers shown are illustrative and subject to dealership verification.",
  offers: [
    { id: "o1", type: "Exchange", title: "Exchange your old vehicle", text: "Tell us about your current bike and we will share an evaluation after inspection.", cta: "exchange" },
    { id: "o2", type: "Finance", title: "Finance assistance", text: "Get help choosing a down payment and tenure that suit your budget.", cta: "emi" },
    { id: "o3", type: "Seasonal", title: "Festive season campaign", text: "Sample campaign space. Add your real festival offers here.", cta: "general" },
    { id: "o4", type: "Accessories", title: "Accessories bundle", text: "Ask about helmet and riding gear bundles with a new bike.", cta: "accessories" }
  ]
};
