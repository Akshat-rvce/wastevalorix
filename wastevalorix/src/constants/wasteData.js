export const WASTE_TYPES = [
  {
    id: 'food',
    name: 'Food / Kitchen Waste',
    icon: '🥬',
    category: 'Organic',
    method: 'Anaerobic Digestion (Biogas)',
    methodDetail: 'Microorganisms break down organic matter in the absence of oxygen to produce biogas (rich in methane) and digestate. The biogas is combusted in a CHP unit to generate electricity.',
    kwhPerKg: 0.35,
    co2PerKg: 0.50,
    biogasM3PerKg: 0.05,
    efficiency: 85,
    color: '#00E676', // Green
    tips: [
      'Separate properly at source to avoid contamination.',
      'Can be co-digested with agricultural waste to increase yield.',
      'The byproduct (digestate) is a premium organic fertilizer.'
    ],
    didYouKnow: 'One ton of food waste processed via anaerobic digestion can power an average home for over 2 weeks.',
    description: 'High-moisture organic material perfectly suited for biogas production rather than incineration.'
  },
  {
    id: 'agri',
    name: 'Agricultural Waste',
    icon: '🌾',
    category: 'Organic',
    method: 'Biomass Gasification',
    methodDetail: 'Controlled heating with limited oxygen converts the biomass into syngas. The syngas is then burned to run a turbine for electricity generation.',
    kwhPerKg: 0.42,
    co2PerKg: 0.60,
    biogasM3PerKg: 0,
    efficiency: 75,
    color: '#00C853',
    tips: [
      'Ensure material is dried adequately before gasification.',
      'Shredding crop residue improves gas flow and conversion efficiency.',
      'Ash residue can be returned to fields to improve soil.'
    ],
    didYouKnow: 'Gasification operates at temperatures exceeding 700°C without combustion.',
    description: 'Dry organic residue from farming operations, excellent for syngas conversion.'
  },
  {
    id: 'wood',
    name: 'Wood / Garden Waste',
    icon: '🪵',
    category: 'Lignocellulosic',
    method: 'Direct Combustion (Incineration)',
    methodDetail: 'The woody waste is burned in a controlled environment to produce high-pressure steam. This steam drives a turbine connected to a generator to produce electricity.',
    kwhPerKg: 0.55,
    co2PerKg: 0.80,
    biogasM3PerKg: 0,
    efficiency: 80,
    color: '#795548', // Brown
    tips: [
      'Pelletizing wood waste increases its energy density.',
      'Maintain moisture content below 20% for optimal heating value.',
      'Implement flue-gas cleaning to reduce particulate emissions.'
    ],
    didYouKnow: 'Wood has been the primary energy biomass throughout human history.',
    description: 'Tough, fibrous biomass with a relatively high calorific value when dried.'
  },
  {
    id: 'plastic',
    name: 'Plastic Waste',
    icon: '🧴',
    category: 'Synthetic',
    method: 'Pyrolysis',
    methodDetail: 'Thermal decomposition of plastics at elevated temperatures in an inert atmosphere. It produces synthetic oil, syngas, and char, which can be further processed into fuel.',
    kwhPerKg: 0.92,
    co2PerKg: 1.35,
    biogasM3PerKg: 0,
    efficiency: 70,
    color: '#2196F3', // Blue
    tips: [
      'Only use non-recyclable plastics (residue) for pyrolysis.',
      'Avoid PVC plastics as they release harmful chlorine compounds.',
      'The generated oil can be upgraded to diesel-equivalent fuel.'
    ],
    didYouKnow: 'Plastics are derived from petroleum, which is why their calorific heating value is extremely high.',
    description: 'High-energy synthetic material best converted to oil or syngas via thermal degradation.'
  },
  {
    id: 'paper',
    name: 'Paper / Cardboard',
    icon: '📦',
    category: 'Cellulosic',
    method: 'Refuse-Derived Fuel (RDF)',
    methodDetail: 'Paper and cardboard are shredded, dried, and compressed into combustible pellets. These are used as a coal substitute in industrial furnaces.',
    kwhPerKg: 0.28,
    co2PerKg: 0.40,
    biogasM3PerKg: 0,
    efficiency: 65,
    color: '#FFEB3B', // Yellow
    tips: [
      'Recycle high-quality paper first; only use soiled paper for energy.',
      'Must be kept dry prior to pelletization.',
      'Mixing with small amounts of plastic can improve the calorific value.'
    ],
    didYouKnow: 'Using RDF from cardboard significantly lowers the carbon footprint of cement kilns.',
    description: 'Lightweight cellulosic waste that works well as a highly combustible fuel pellet.'
  },
  {
    id: 'textile',
    name: 'Textile Waste',
    icon: '👕',
    category: 'Synthetic',
    method: 'Solid Recovered Fuel (SRF)',
    methodDetail: 'Non-wearable textiles, especially synthetics like polyester, are processed into standardized fuel shreds. SRF is burned for industrial heating and electricity.',
    kwhPerKg: 0.65,
    co2PerKg: 0.95,
    biogasM3PerKg: 0,
    efficiency: 68,
    color: '#E91E63', // Pink
    tips: [
      'Remove zippers and metal buttons using magnetic separators.',
      'Blend with other dry commercial waste to stabilize burning temp.',
      'Ensure thorough shredding to prevent feed-line blockages.'
    ],
    didYouKnow: 'Polyester-based clothing has nearly the same energy content as some grades of coal.',
    description: 'A mix of natural and synthetic fibers that possesses a high heating value.'
  },
  {
    id: 'rubber',
    name: 'Rubber / Tyres',
    icon: '⚫',
    category: 'Synthetic',
    method: 'Tyre-derived Fuel (TDF) or Pyrolysis',
    methodDetail: 'Shredded tyres are either burned directly in high-heat systems (like cement kilns) or pyrolyzed to extract carbon black, steel, and oil/gas for generation.',
    kwhPerKg: 0.88,
    co2PerKg: 1.30,
    biogasM3PerKg: 0,
    efficiency: 85,
    color: '#9E9E9E', // Grey
    tips: [
      'Extract steel wire components before combustion.',
      'Tyres must be shredded into uniform "chips" to ensure steady burn.',
      'TDF provides 25% more energy than coal by weight.'
    ],
    didYouKnow: 'Scrap tyres produce intense heat and reduce the nitrogen oxide emissions of some kilns.',
    description: 'Extremely high energy density material yielding substantial thermal output.'
  },
  {
    id: 'metal',
    name: 'Metal / E-Waste',
    icon: '🔩',
    category: 'Inorganic',
    method: 'Not Recommended for Energy',
    methodDetail: 'Metals and electronics have virtually no calorific value. The negligible energy output comes strictly from recovering trace combustible plastics attached to the e-waste.',
    kwhPerKg: 0.15,
    co2PerKg: 0.20,
    biogasM3PerKg: 0,
    efficiency: 10,
    color: '#607D8B', // Blue Grey
    tips: [
      'Do NOT attempt to burn this. Send for metal/mineral recycling.',
      'E-waste contains hazardous heavy metals that pollute air if incinerated.',
      'The best "energy saved" is the embodied energy from recycling the metal.'
    ],
    didYouKnow: 'Recycling aluminum saves 95% of the energy needed to make new aluminum from raw bauxite.',
    description: 'Inorganic material that should be recycled, not converted to energy.'
  },
  {
    id: 'sewage',
    name: 'Sewage Sludge',
    icon: '💧',
    category: 'Organic',
    method: 'Anaerobic Digestion / Co-incineration',
    methodDetail: 'Sludge is thickened and digested to yield biogas. The remaining dried sludge can also be co-incinerated in centralized power plants.',
    kwhPerKg: 0.22,
    co2PerKg: 0.30,
    biogasM3PerKg: 0.03,
    efficiency: 60,
    color: '#009688', // Teal
    tips: [
      'Dewatering is a critical first step to improve net energy yield.',
      'Thermal hydrolysis pre-treatment can drastically boost biogas output.',
      'Phosphorus can be recovered from the remaining ash.'
    ],
    didYouKnow: 'Modern wastewater plants use sludge energy to power their entire operation.',
    description: 'Semi-solid residual material from wastewater treatment containing organic carbon.'
  },
  {
    id: 'msw',
    name: 'Mixed Municipal',
    icon: '🗑️',
    category: 'Mixed',
    method: 'Mass-Burn WtE',
    methodDetail: 'The raw, unsorted municipal solid waste is combusted in a moving grate incinerator. The heat boils water to steam, which creates electricity via a turbine.',
    kwhPerKg: 0.48,
    co2PerKg: 0.70,
    biogasM3PerKg: 0,
    efficiency: 25, // Lower electrical efficiency but high volume
    color: '#FF9800', // Orange
    tips: [
      'Pre-sorting organics and recyclables dramatically increases heating value.',
      'Advanced scrubber systems are legally required to capture toxic gases.',
      'Works best as a baseline continuous energy provider.'
    ],
    didYouKnow: 'Mass-burn WtE plants reduce the volume of incoming garbage by about 90%.',
    description: 'Common household trash requiring industrial-scale incineration for energy recovery.'
  }
];

export const CONVERSION_METHODS = {
  'Anaerobic Digestion (Biogas)': 'Biological breakdown of organic material in absence of oxygen. Best for high-moisture organics like food and agricultural waste.',
  'Biomass Gasification': 'Thermochemical process converting dry biomass into a combustible syngas using heat and limited air.',
  'Direct Combustion (Incineration)': 'Burning of waste to heat boilers, generating steam for turbines. Suitable for lignocellulosic and mixed waste.',
  'Pyrolysis': 'Thermal decomposition in an oxygen-free environment. Excellent for plastics and rubber to produce liquid fuels and char.',
  'Refuse-Derived Fuel (RDF)': 'Processing solid waste to remove non-combustibles and pelletizing the remainder for use in industrial kilns.',
  'Solid Recovered Fuel (SRF)': 'A high-grade form of RDF with stricter specifications for calorific value and chlorine content, ideal for textiles/synthetics.',
  'Tyre-derived Fuel (TDF)': 'Scrap tyres shredded for use as a high-heat fuel supplement.',
  'Mass-Burn WtE': 'Large-scale incineration of unsorted municipal solid waste on an industrial moving grate.'
};

export const ENERGY_RATES = { 
  electricityRate: 7, 
  biogasRate: 45 
};
