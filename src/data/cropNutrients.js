// src/data/cropNutrients.js
// Example data - Expand with more crops and accurate recommendations
export const cropNutrientDefaults = {
    Wheat: { recN: 120, recP: 60, recK: 40 }, // Recommended kg/hectare
    Rice: { recN: 100, recP: 50, recK: 50 },
    Maize: { recN: 150, recP: 75, recK: 60 },
    Cotton: { recN: 80, recP: 40, recK: 40 },
    Soybean: { recN: 20, recP: 80, recK: 40 }, // Legume, needs less N
    // Add more crops relevant to your target audience
  };