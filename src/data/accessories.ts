// SAMPLE accessories. Prices are indicative only.
export type AccCategory = "Helmets" | "Riding jackets" | "Gloves" | "Luggage" | "Bike accessories" | "Safety gear";
export const accCategories: AccCategory[] = ["Helmets", "Riding jackets", "Gloves", "Luggage", "Bike accessories", "Safety gear"];
export const accessories: { id: string; name: string; category: AccCategory; price: number }[] = [
  { id: "a1", name: "Full-face helmet", category: "Helmets", price: 3500 },
  { id: "a2", name: "Open-face helmet", category: "Helmets", price: 1800 },
  { id: "a3", name: "Mesh riding jacket", category: "Riding jackets", price: 4500 },
  { id: "a4", name: "Touring jacket", category: "Riding jackets", price: 7500 },
  { id: "a5", name: "Riding gloves", category: "Gloves", price: 1200 },
  { id: "a6", name: "Winter gloves", category: "Gloves", price: 1800 },
  { id: "a7", name: "Tail bag", category: "Luggage", price: 2500 },
  { id: "a8", name: "Saddle bags (pair)", category: "Luggage", price: 4800 },
  { id: "a9", name: "Phone mount", category: "Bike accessories", price: 900 },
  { id: "a10", name: "Bike cover", category: "Bike accessories", price: 700 },
  { id: "a11", name: "Knee and elbow guards", category: "Safety gear", price: 2200 },
  { id: "a12", name: "Reflective vest", category: "Safety gear", price: 500 }
];
