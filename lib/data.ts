interface VitaminData {
  [key: string]: string
}

interface Product {
  name: string
  vitamins: VitaminData
}

interface Profile {
  age: number
  sex: 'male' | 'female'
  isPregnant?: boolean
}

interface Recommendations {
  [key: string]: {
    amount: string
    upperLimit?: string
  }
}

// Sample product database
const PRODUCTS: { [key: string]: Product } = {
  '123456789': {
    name: 'Centrum Adult Multivitamin',
    vitamins: {
      'Vitamin A': '3500 IU',
      'Vitamin C': '90 mg',
      'Vitamin D': '1000 IU',
      'Vitamin E': '45 IU',
      'Vitamin K': '25 mcg',
      'Thiamin': '1.5 mg',
      'Riboflavin': '1.7 mg',
      'Niacin': '20 mg',
      'Vitamin B6': '2 mg',
      'Folate': '400 mcg',
      'Vitamin B12': '25 mcg',
      'Biotin': '40 mcg',
      'Pantothenic Acid': '10 mg',
      'Calcium': '200 mg',
      'Iron': '8 mg',
      'Phosphorus': '20 mg',
      'Iodine': '150 mcg',
      'Magnesium': '50 mg',
      'Zinc': '11 mg',
      'Selenium': '55 mcg',
      'Copper': '0.5 mg',
      'Manganese': '2.3 mg',
      'Chromium': '45 mcg',
      'Molybdenum': '50 mcg'
    }
  },
  'one a day': {
    name: 'One A Day Women\'s Multivitamin',
    vitamins: {
      'Vitamin A': '2333 IU',
      'Vitamin C': '75 mg',
      'Vitamin D': '1000 IU',
      'Vitamin E': '30 IU',
      'Vitamin K': '25 mcg',
      'Thiamin': '1.5 mg',
      'Riboflavin': '1.7 mg',
      'Niacin': '20 mg',
      'Vitamin B6': '2 mg',
      'Folate': '400 mcg',
      'Vitamin B12': '6 mcg',
      'Biotin': '40 mcg',
      'Pantothenic Acid': '10 mg',
      'Calcium': '450 mg',
      'Iron': '18 mg',
      'Iodine': '150 mcg',
      'Magnesium': '50 mg',
      'Zinc': '8 mg',
      'Selenium': '20 mcg',
      'Copper': '0.9 mg',
      'Manganese': '1.8 mg',
      'Chromium': '25 mcg',
      'Molybdenum': '50 mcg'
    }
  }
}

// RDA recommendations by demographic
const RDA_DATA = {
  'female_19-50': {
    'Vitamin A': { amount: '700 mcg', upperLimit: '3000 mcg' },
    'Vitamin C': { amount: '75 mg', upperLimit: '2000 mg' },
    'Vitamin D': { amount: '600 IU', upperLimit: '4000 IU' },
    'Vitamin E': { amount: '15 mg', upperLimit: '1000 mg' },
    'Vitamin K': { amount: '90 mcg' },
    'Thiamin': { amount: '1.1 mg' },
    'Riboflavin': { amount: '1.1 mg' },
    'Niacin': { amount: '14 mg', upperLimit: '35 mg' },
    'Vitamin B6': { amount: '1.3 mg', upperLimit: '100 mg' },
    'Folate': { amount: '400 mcg', upperLimit: '1000 mcg' },
    'Vitamin B12': { amount: '2.4 mcg' },
    'Biotin': { amount: '30 mcg' },
    'Pantothenic Acid': { amount: '5 mg' },
    'Calcium': { amount: '1000 mg', upperLimit: '2500 mg' },
    'Iron': { amount: '18 mg', upperLimit: '45 mg' },
    'Magnesium': { amount: '310 mg', upperLimit: '350 mg' },
    'Zinc': { amount: '8 mg', upperLimit: '40 mg' },
    'Selenium': { amount: '55 mcg', upperLimit: '400 mcg' }
  },
  'male_19-50': {
    'Vitamin A': { amount: '900 mcg', upperLimit: '3000 mcg' },
    'Vitamin C': { amount: '90 mg', upperLimit: '2000 mg' },
    'Vitamin D': { amount: '600 IU', upperLimit: '4000 IU' },
    'Vitamin E': { amount: '15 mg', upperLimit: '1000 mg' },
    'Vitamin K': { amount: '120 mcg' },
    'Thiamin': { amount: '1.2 mg' },
    'Riboflavin': { amount: '1.3 mg' },
    'Niacin': { amount: '16 mg', upperLimit: '35 mg' },
    'Vitamin B6': { amount: '1.3 mg', upperLimit: '100 mg' },
    'Folate': { amount: '400 mcg', upperLimit: '1000 mcg' },
    'Vitamin B12': { amount: '2.4 mcg' },
    'Biotin': { amount: '30 mcg' },
    'Pantothenic Acid': { amount: '5 mg' },
    'Calcium': { amount: '1000 mg', upperLimit: '2500 mg' },
    'Iron': { amount: '8 mg', upperLimit: '45 mg' },
    'Magnesium': { amount: '400 mg', upperLimit: '350 mg' },
    'Zinc': { amount: '11 mg', upperLimit: '40 mg' },
    'Selenium': { amount: '55 mcg', upperLimit: '400 mcg' }
  }
}

type NutrientEntry = { amount: string; upperLimit?: string };
type Group = Record<
  | "Vitamin A"
  | "Vitamin C"
  | "Vitamin D"
  | "Vitamin E"
  | "Vitamin K"
  | "Thiamin"
  | "Riboflavin"
  | "Niacin"
  | "Vitamin B6"
  | "Folate"
  | "Vitamin B12"
  | "Pantothenic Acid"
  | "Biotin"
  | "Choline",
  NutrientEntry
>;

// Helper (internal): choline UL by age (mg)
const UL = {
  vitA: { infant: "600 µg", "1-3": "600 µg", "4-8": "900 µg", "9-13": "1700 µg", "14-18": "2800 µg", adult: "3000 µg" },
  vitC: { "1-3": "400 mg", "4-8": "650 mg", "9-13": "1200 mg", "14-18": "1800 mg", adult: "2000 mg" }, // infants: not established
  vitD: { "0-6mo": "25 µg", "7-12mo": "38 µg", "1-3": "63 µg", "4-8": "75 µg", "9-18": "100 µg", adult: "100 µg" },
  vitE: { "1-3": "200 mg", "4-8": "300 mg", "9-13": "600 mg", "14-18": "800 mg", adult: "1000 mg" },
  niacin: { "1-3": "10 mg", "4-8": "15 mg", "9-13": "20 mg", "14-18": "30 mg", adult: "35 mg" },
  b6: { "1-3": "30 mg", "4-8": "40 mg", "9-13": "60 mg", "14-18": "80 mg", adult: "100 mg" },
  folateDFE: { "1-3": "300 µg", "4-8": "400 µg", "9-13": "600 µg", "14-18": "800 µg", adult: "1000 µg" },
  choline: { "1-8": "1000 mg", "9-13": "2000 mg", "14-18": "3000 mg", "19-70": "3500 mg", "70+": "3000 mg" }
};

// RDA/AI + ULs (vitamins only) by demographic
export const RDA_DATA2: Record<string, Group> = {
  // INFANTS
  "infant_0-6mo": {
    "Vitamin A": { amount: "400 µg" /* AI */, upperLimit: UL.vitA.infant },
    "Vitamin C": { amount: "40 mg" /* AI */ }, // UL not established
    "Vitamin D": { amount: "10 µg" /* 400 IU AI */, upperLimit: UL.vitD["0-6mo"] },
    "Vitamin E": { amount: "4 mg" /* AI */ }, // UL not established
    "Vitamin K": { amount: "2.0 µg" /* AI */ }, // no UL
    "Thiamin": { amount: "0.2 mg" /* AI */ }, // no UL
    "Riboflavin": { amount: "0.3 mg" /* AI */ }, // no UL
    "Niacin": { amount: "2 mg" /* AI */ }, // UL n/a for infants
    "Vitamin B6": { amount: "0.1 mg" /* AI */ }, // UL n/a for infants
    "Folate": { amount: "65 µg" /* AI */ }, // UL n/a for infants
    "Vitamin B12": { amount: "0.4 µg" /* AI */ }, // no UL
    "Pantothenic Acid": { amount: "1.7 mg" /* AI */ }, // no UL
    "Biotin": { amount: "5 µg" /* AI */ }, // no UL
    "Choline": { amount: "125 mg" /* AI */ } // UL n/a for infants
  },
  "infant_6-12mo": {
    "Vitamin A": { amount: "500 µg" /* AI */, upperLimit: UL.vitA.infant },
    "Vitamin C": { amount: "50 mg" /* AI */ },
    "Vitamin D": { amount: "10 µg" /* 400 IU AI */, upperLimit: UL.vitD["7-12mo"] },
    "Vitamin E": { amount: "5 mg" /* AI */ },
    "Vitamin K": { amount: "2.5 µg" /* AI */ },
    "Thiamin": { amount: "0.3 mg" /* AI */ },
    "Riboflavin": { amount: "0.4 mg" /* AI */ },
    "Niacin": { amount: "4 mg" /* AI */ },
    "Vitamin B6": { amount: "0.3 mg" /* AI */ },
    "Folate": { amount: "80 µg" /* AI */ },
    "Vitamin B12": { amount: "0.5 µg" /* AI */ },
    "Pantothenic Acid": { amount: "1.8 mg" /* AI */ },
    "Biotin": { amount: "6 µg" /* AI */ },
    "Choline": { amount: "150 mg" /* AI */ }
  },

  // CHILDREN
  "child_1-3": {
    "Vitamin A": { amount: "300 µg", upperLimit: UL.vitA["1-3"] },
    "Vitamin C": { amount: "15 mg", upperLimit: UL.vitC["1-3"] },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD["1-3"] },
    "Vitamin E": { amount: "6 mg", upperLimit: UL.vitE["1-3"] },
    "Vitamin K": { amount: "30 µg" },
    "Thiamin": { amount: "0.5 mg" },
    "Riboflavin": { amount: "0.5 mg" },
    "Niacin": { amount: "6 mg", upperLimit: UL.niacin["1-3"] },
    "Vitamin B6": { amount: "0.5 mg", upperLimit: UL.b6["1-3"] },
    "Folate": { amount: "150 µg", upperLimit: UL.folateDFE["1-3"] },
    "Vitamin B12": { amount: "0.9 µg" },
    "Pantothenic Acid": { amount: "2 mg" },
    "Biotin": { amount: "8 µg" },
    "Choline": { amount: "200 mg", upperLimit: UL.choline["1-8"] }
  },
  "child_4-8": {
    "Vitamin A": { amount: "400 µg", upperLimit: UL.vitA["4-8"] },
    "Vitamin C": { amount: "25 mg", upperLimit: UL.vitC["4-8"] },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD["4-8"] },
    "Vitamin E": { amount: "7 mg", upperLimit: UL.vitE["4-8"] },
    "Vitamin K": { amount: "55 µg" },
    "Thiamin": { amount: "0.6 mg" },
    "Riboflavin": { amount: "0.6 mg" },
    "Niacin": { amount: "8 mg", upperLimit: UL.niacin["4-8"] },
    "Vitamin B6": { amount: "0.6 mg", upperLimit: UL.b6["4-8"] },
    "Folate": { amount: "200 µg", upperLimit: UL.folateDFE["4-8"] },
    "Vitamin B12": { amount: "1.2 µg" },
    "Pantothenic Acid": { amount: "3 mg" },
    "Biotin": { amount: "12 µg" },
    "Choline": { amount: "250 mg", upperLimit: UL.choline["1-8"] }
  },

  // MALES
  "male_9-13": {
    "Vitamin A": { amount: "600 µg", upperLimit: UL.vitA["9-13"] },
    "Vitamin C": { amount: "45 mg", upperLimit: UL.vitC["9-13"] },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD["9-18"] },
    "Vitamin E": { amount: "11 mg", upperLimit: UL.vitE["9-13"] },
    "Vitamin K": { amount: "60 µg" },
    "Thiamin": { amount: "0.9 mg" },
    "Riboflavin": { amount: "0.9 mg" },
    "Niacin": { amount: "12 mg", upperLimit: UL.niacin["9-13"] },
    "Vitamin B6": { amount: "1.0 mg", upperLimit: UL.b6["9-13"] },
    "Folate": { amount: "300 µg", upperLimit: UL.folateDFE["9-13"] },
    "Vitamin B12": { amount: "1.8 µg" },
    "Pantothenic Acid": { amount: "4 mg" },
    "Biotin": { amount: "20 µg" },
    "Choline": { amount: "375 mg", upperLimit: UL.choline["9-13"] }
  },
  "male_14-18": {
    "Vitamin A": { amount: "900 µg", upperLimit: UL.vitA["14-18"] },
    "Vitamin C": { amount: "75 mg", upperLimit: UL.vitC["14-18"] },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD["9-18"] },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE["14-18"] },
    "Vitamin K": { amount: "75 µg" },
    "Thiamin": { amount: "1.2 mg" },
    "Riboflavin": { amount: "1.3 mg" },
    "Niacin": { amount: "16 mg", upperLimit: UL.niacin["14-18"] },
    "Vitamin B6": { amount: "1.3 mg", upperLimit: UL.b6["14-18"] },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE["14-18"] },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "25 µg" },
    "Choline": { amount: "550 mg", upperLimit: UL.choline["14-18"] }
  },
  "male_19-30": {
    "Vitamin A": { amount: "900 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "90 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "120 µg" },
    "Thiamin": { amount: "1.2 mg" },
    "Riboflavin": { amount: "1.3 mg" },
    "Niacin": { amount: "16 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.3 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "550 mg", upperLimit: UL.choline["19-70"] }
  },
  "male_31-50": {
    "Vitamin A": { amount: "900 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "90 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "120 µg" },
    "Thiamin": { amount: "1.2 mg" },
    "Riboflavin": { amount: "1.3 mg" },
    "Niacin": { amount: "16 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.3 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "550 mg", upperLimit: UL.choline["19-70"] }
  },
  "male_51-70": {
    "Vitamin A": { amount: "900 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "90 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "120 µg" },
    "Thiamin": { amount: "1.2 mg" },
    "Riboflavin": { amount: "1.3 mg" },
    "Niacin": { amount: "16 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.7 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "550 mg", upperLimit: UL.choline["19-70"] }
  },
  "male_70+": {
    "Vitamin A": { amount: "900 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "90 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "20 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "120 µg" },
    "Thiamin": { amount: "1.2 mg" },
    "Riboflavin": { amount: "1.3 mg" },
    "Niacin": { amount: "16 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.7 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "550 mg", upperLimit: UL.choline["70+"] }
  },

  // FEMALES
  "female_9-13": {
    "Vitamin A": { amount: "600 µg", upperLimit: UL.vitA["9-13"] },
    "Vitamin C": { amount: "45 mg", upperLimit: UL.vitC["9-13"] },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD["9-18"] },
    "Vitamin E": { amount: "11 mg", upperLimit: UL.vitE["9-13"] },
    "Vitamin K": { amount: "60 µg" },
    "Thiamin": { amount: "0.9 mg" },
    "Riboflavin": { amount: "0.9 mg" },
    "Niacin": { amount: "12 mg", upperLimit: UL.niacin["9-13"] },
    "Vitamin B6": { amount: "1.0 mg", upperLimit: UL.b6["9-13"] },
    "Folate": { amount: "300 µg", upperLimit: UL.folateDFE["9-13"] },
    "Vitamin B12": { amount: "1.8 µg" },
    "Pantothenic Acid": { amount: "4 mg" },
    "Biotin": { amount: "20 µg" },
    "Choline": { amount: "375 mg", upperLimit: UL.choline["9-13"] }
  },
  "female_14-18": {
    "Vitamin A": { amount: "700 µg", upperLimit: UL.vitA["14-18"] },
    "Vitamin C": { amount: "65 mg", upperLimit: UL.vitC["14-18"] },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD["9-18"] },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE["14-18"] },
    "Vitamin K": { amount: "75 µg" },
    "Thiamin": { amount: "1.0 mg" },
    "Riboflavin": { amount: "1.0 mg" },
    "Niacin": { amount: "14 mg", upperLimit: UL.niacin["14-18"] },
    "Vitamin B6": { amount: "1.2 mg", upperLimit: UL.b6["14-18"] },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE["14-18"] },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "25 µg" },
    "Choline": { amount: "400 mg", upperLimit: UL.choline["14-18"] }
  },
  "female_19-30": {
    "Vitamin A": { amount: "700 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "75 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "90 µg" },
    "Thiamin": { amount: "1.1 mg" },
    "Riboflavin": { amount: "1.1 mg" },
    "Niacin": { amount: "14 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.3 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "425 mg", upperLimit: UL.choline["19-70"] }
  },
  "female_31-50": {
    "Vitamin A": { amount: "700 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "75 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "90 µg" },
    "Thiamin": { amount: "1.1 mg" },
    "Riboflavin": { amount: "1.1 mg" },
    "Niacin": { amount: "14 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.3 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "425 mg", upperLimit: UL.choline["19-70"] }
  },
  "female_51-70": {
    "Vitamin A": { amount: "700 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "75 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "90 µg" },
    "Thiamin": { amount: "1.1 mg" },
    "Riboflavin": { amount: "1.1 mg" },
    "Niacin": { amount: "14 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.5 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "425 mg", upperLimit: UL.choline["19-70"] }
  },
  "female_70+": {
    "Vitamin A": { amount: "700 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "75 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "20 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "90 µg" },
    "Thiamin": { amount: "1.1 mg" },
    "Riboflavin": { amount: "1.1 mg" },
    "Niacin": { amount: "14 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.5 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "400 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.4 µg" },
    "Pantothenic Acid": { amount: "5 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "425 mg", upperLimit: UL.choline["70+"] }
  },

  // PREGNANCY
  "pregnancy_14-18": {
    "Vitamin A": { amount: "750 µg", upperLimit: UL.vitA["14-18"] },
    "Vitamin C": { amount: "80 mg", upperLimit: UL.vitC["14-18"] },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD["9-18"] },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE["14-18"] },
    "Vitamin K": { amount: "75 µg" },
    "Thiamin": { amount: "1.4 mg" },
    "Riboflavin": { amount: "1.4 mg" },
    "Niacin": { amount: "18 mg", upperLimit: UL.niacin["14-18"] },
    "Vitamin B6": { amount: "1.9 mg", upperLimit: UL.b6["14-18"] },
    "Folate": { amount: "600 µg", upperLimit: UL.folateDFE["14-18"] },
    "Vitamin B12": { amount: "2.6 µg" },
    "Pantothenic Acid": { amount: "6 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "450 mg", upperLimit: UL.choline["14-18"] }
  },
  "pregnancy_19-30": {
    "Vitamin A": { amount: "770 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "85 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "90 µg" },
    "Thiamin": { amount: "1.4 mg" },
    "Riboflavin": { amount: "1.4 mg" },
    "Niacin": { amount: "18 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.9 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "600 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.6 µg" },
    "Pantothenic Acid": { amount: "6 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "450 mg", upperLimit: UL.choline["19-70"] }
  },
  "pregnancy_31-50": {
    "Vitamin A": { amount: "770 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "85 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "15 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "90 µg" },
    "Thiamin": { amount: "1.4 mg" },
    "Riboflavin": { amount: "1.4 mg" },
    "Niacin": { amount: "18 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "1.9 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "600 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.6 µg" },
    "Pantothenic Acid": { amount: "6 mg" },
    "Biotin": { amount: "30 µg" },
    "Choline": { amount: "450 mg", upperLimit: UL.choline["19-70"] }
  },

  // LACTATION
  "lactation_14-18": {
    "Vitamin A": { amount: "1200 µg", upperLimit: UL.vitA["14-18"] },
    "Vitamin C": { amount: "115 mg", upperLimit: UL.vitC["14-18"] },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD["9-18"] },
    "Vitamin E": { amount: "19 mg", upperLimit: UL.vitE["14-18"] },
    "Vitamin K": { amount: "75 µg" },
    "Thiamin": { amount: "1.4 mg" },
    "Riboflavin": { amount: "1.6 mg" },
    "Niacin": { amount: "17 mg", upperLimit: UL.niacin["14-18"] },
    "Vitamin B6": { amount: "2.0 mg", upperLimit: UL.b6["14-18"] },
    "Folate": { amount: "500 µg", upperLimit: UL.folateDFE["14-18"] },
    "Vitamin B12": { amount: "2.8 µg" },
    "Pantothenic Acid": { amount: "7 mg" },
    "Biotin": { amount: "35 µg" },
    "Choline": { amount: "550 mg", upperLimit: UL.choline["14-18"] }
  },
  "lactation_19-30": {
    "Vitamin A": { amount: "1300 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "120 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "19 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "90 µg" },
    "Thiamin": { amount: "1.4 mg" },
    "Riboflavin": { amount: "1.6 mg" },
    "Niacin": { amount: "17 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "2.0 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "500 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.8 µg" },
    "Pantothenic Acid": { amount: "7 mg" },
    "Biotin": { amount: "35 µg" },
    "Choline": { amount: "550 mg", upperLimit: UL.choline["19-70"] }
  },
  "lactation_31-50": {
    "Vitamin A": { amount: "1300 µg", upperLimit: UL.vitA.adult },
    "Vitamin C": { amount: "120 mg", upperLimit: UL.vitC.adult },
    "Vitamin D": { amount: "15 µg", upperLimit: UL.vitD.adult },
    "Vitamin E": { amount: "19 mg", upperLimit: UL.vitE.adult },
    "Vitamin K": { amount: "90 µg" },
    "Thiamin": { amount: "1.4 mg" },
    "Riboflavin": { amount: "1.6 mg" },
    "Niacin": { amount: "17 mg", upperLimit: UL.niacin.adult },
    "Vitamin B6": { amount: "2.0 mg", upperLimit: UL.b6.adult },
    "Folate": { amount: "500 µg", upperLimit: UL.folateDFE.adult },
    "Vitamin B12": { amount: "2.8 µg" },
    "Pantothenic Acid": { amount: "7 mg" },
    "Biotin": { amount: "35 µg" },
    "Choline": { amount: "550 mg", upperLimit: UL.choline["19-70"] }
  }
};


export function getProductData(identifier: string, type: 'barcode' | 'name' = 'barcode'): Product | null {
  if (type === 'name') {
    const key = Object.keys(PRODUCTS).find(k => 
      PRODUCTS[k].name.toLowerCase().includes(identifier.toLowerCase())
    )
    return key ? PRODUCTS[key] : null
  }
  return PRODUCTS[identifier] || null
}

export function getRecommendations(profile: Profile): Recommendations {
  const key = profile.sex === 'female' ? 'female_19-50' : 'male_19-50'
  return RDA_DATA[key] || RDA_DATA['female_19-50']
}

export function compareVitamins(productVitamins: VitaminData, recommendations: Recommendations) {
  const results = []
  
  for (const [vitaminName, rec] of Object.entries(recommendations)) {
    const productAmount = productVitamins[vitaminName] || '0'
    
    // Simple comparison logic (would need more sophisticated parsing in production)
    const productValue = parseFloat(productAmount)
    const recValue = parseFloat(rec.amount)
    const upperLimit = rec.upperLimit ? parseFloat(rec.upperLimit) : null
    
    let status: 'good' | 'low' | 'high' = 'good'
    let statusText = 'Meets your needs'
    
    if (productValue === 0) {
      status = 'low'
      statusText = 'Not provided'
    } else if (upperLimit && productValue > upperLimit) {
      status = 'high'
      statusText = 'Above safe limit'
    } else if (productValue < recValue * 0.8) {
      status = 'low'
      statusText = 'Below recommended'
    } else if (productValue > recValue * 2) {
      status = 'high'
      statusText = 'Much higher than needed'
    }
    
    results.push({
      name: vitaminName,
      productAmount,
      recommendedAmount: rec.amount,
      status,
      statusText
    })
  }
  
  return results
}
