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
