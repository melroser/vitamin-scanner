// netlify/functions/read-label.ts
import type { Handler } from '@netlify/functions'
import OpenAI from 'openai'

const MODEL = 'gpt-4o-mini'

const CANONICAL = [
  'Vitamin A','Vitamin C','Vitamin D','Vitamin E','Vitamin K',
  'Thiamin','Riboflavin','Niacin','Vitamin B6','Folate',
  'Vitamin B12','Pantothenic Acid','Biotin','Choline'
]

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const { imageBase64 } = JSON.parse(event.body || '{}')
    if (!imageBase64 || typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:image/')) {
      return { statusCode: 400, body: 'imageBase64 data URL is required' }
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Use Chat Completions (multimodal) + json_object
    const completion = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: 'json_object' }, // ensures valid JSON
      messages: [
        {
          role: 'user',
          // multimodal content: text + image
          content: [
            {
              type: 'text',
              text:
                `You are an OCR + parser for Supplement/Nutrition Facts images. ` +
                `Extract ONLY vitamins and their amounts WITH units. Ignore %DV and non-vitamins (minerals, fillers, etc.). ` +
                `Normalize keys to EXACTLY this set (skip anything not listed): ` +
                CANONICAL.join(', ') +
                `. Return ONLY JSON of the form: {"vitamins": {"Vitamin A": "700 µg", ...}}`
            },
            {
              type: 'image_url',
              image_url: { url: imageBase64, detail: 'low' } // smaller, cheaper, fine for labels
            }
          ]
        }
      ]
    })

    const content = completion.choices[0]?.message?.content ?? '{}'
    let data: any
    try {
      data = JSON.parse(content)
    } catch {
      // In case the model strays (rare with json_object), fall back to empty map
      data = { vitamins: {} }
    }

    // (Optional) Normalize any near-matches to canonical keys here.

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: 'Label parsing failed' }
  }
}
