const MODELS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash'
];

const makeRequest = async (modelName, base64Image, mediaType, apiKey) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: mediaType,
              data: base64Image
            }
          },
          {
            text: `Analyze this waste image. Reply ONLY with this exact JSON structure, no extra text:
{
  "wasteType":"specific name",
  "broadCategory":"Plastic/Organic/Metal/Paper/Textile/Mixed",
  "specificSubtype":"specific subtype",
  "category":"Organic/Synthetic/Inorganic/Mixed/Lignocellulosic",
  "method":"conversion technology",
  "methodDetail":"how this waste is converted to energy in 3 sentences",
  "kwhPerKg":0.5,
  "co2PerKg":0.7,
  "biogasM3PerKg":0,
  "confidence":90,
  "emoji":"🔩",
  "efficiency":75,
  "marketValuePerKg":8,
  "marketValueCurrency":"INR",
  "marketDemand":"High",
  "qualityScore": 85,
  "qualityGrade": "A",
  "qualityAssessment": "1 sentence on overall visual quality.",
  "conditionFactors": {
    "cleanliness": 90,
    "contamination": 10,
    "moisture": 5,
    "sorting": 80,
    "size_uniformity": 75
  },
  "pricing": {
    "yourPriceMin": 8,
    "yourPriceMax": 12,
    "scrapDealerPrice": 6,
    "premiumPrice": 15,
    "unit": "per kg",
    "trend": "rising",
    "trendPercentage": 5,
    "trendPeriod": "last 3 months",
    "trendReason": "High demand from recycling plants",
    "priceFactors": [
      { "factor": "High Purity", "impact": "positive", "value": "+₹2/kg", "percentage": 15 },
      { "factor": "Slight Moisture", "impact": "negative", "value": "-₹0.5/kg", "percentage": -5 }
    ],
    "quantityBreakpoints": [
      { "qty": "0-50 kg", "price": "₹8/kg" },
      { "qty": "50-200 kg", "price": "₹10/kg" },
      { "qty": "200-500 kg", "price": "₹12/kg" },
      { "qty": "500+ kg", "price": "₹15/kg" }
    ],
    "nearbyMarketPrices": [
      { "city": "Mumbai", "price": 12, "demand": "Very High" },
      { "city": "Delhi", "price": 10, "demand": "High" },
      { "city": "Bangalore", "price": 11, "demand": "High" },
      { "city": "Chennai", "price": 9, "demand": "Medium" }
    ],
    "priceHistory": [
      { "month": "Jan", "price": 7 },
      { "month": "Feb", "price": 7.5 },
      { "month": "Mar", "price": 8 },
      { "month": "Apr", "price": 8.5 },
      { "month": "May", "price": 9 },
      { "month": "Jun", "price": 10 }
    ],
    "bestTimeToSell": "Sell Now - Peak Demand",
    "negotiationTips": [
      "Ensure material is dry to avoid weight deduction.",
      "Sort by color for premium pricing."
    ]
  },
  "buyers":[{"buyerName":"EcoMetals Processing India","location":"Peenya Industrial Area, Bangalore","contact":"+91 9876543210","buyerType":"Recycling Plant","priceRangeMin":5,"priceRangeMax":15,"unit":"per kg","notes":"Min 50kg"}],
  "description":"3 sentences about this waste",
  "environmentalImpact":"landfill impact in 2 sentences",
  "tips":["tip1","tip2","tip3"],
  "didYouKnow":"interesting fact",
  "processingSteps":["Step 1","Step 2","Step 3","Step 4"],
  "qualityFactors":["factor1","factor2"],
  "nearbyFacilityTypes":["facility type in India"]
}
USE ACTUAL 2024-2025 INDIAN SCRAP/RECYCLING MARKET RATES FOR PRICING.
`
          }
        ]
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 16384 }
    })
  });

  if (response.status === 429) throw new Error('429');
  if (response.status === 404) throw new Error('404');
  if (!response.ok) throw new Error(`HTTP_${response.status}`);

  const data = await response.json();
  console.log('=== GEMINI RAW RESPONSE ===');
  console.log('Status:', response.status);
  console.log('Full body:', JSON.stringify(data, null, 2));
  const candidate = data.candidates?.[0];
  if (candidate && candidate.finishReason && candidate.finishReason !== 'STOP') {
    throw new Error('Blocked by Gemini. Reason: ' + candidate.finishReason);
  }
  const text = candidate?.content?.parts?.[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/s);
  console.log('Extracted text from Gemini:', text);
  if (!match) throw new Error('NO_JSON: ' + (text ? text.substring(0, 50) + '...' : 'Empty response (Check Console)'));
  return JSON.parse(match[0]);
};

// Try each model, move to next on 404, wait+retry on 429
export async function analyzeWasteWithGemini(base64Image, mediaType) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      return await makeRequest(model, base64Image, mediaType, apiKey);
    } catch (err) {
      if (err.message === '404' || err.message === 'HTTP_503') {
        console.log(`${model} not found or unavailable, trying next...`);
        continue; // try next model
      }
      if (err.message === '429') {
        console.log('Rate limited, waiting 15s...');
        await new Promise(r => setTimeout(r, 15000));
        try {
          return await makeRequest(model, base64Image, mediaType, apiKey); // one retry
        } catch (retryErr) {
          throw new Error('Rate limit — please wait 1 minute and try again');
        }
      }
      throw err;
    }
  }
  throw new Error('All AI models unavailable — please try again later');
}
