import React, { useState, useEffect } from 'react';
import { Scale, Box as BoxIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DENSITIES = [
  { id: 'plastic_loose', name: 'Loose plastic bottles', val: 30 },
  { id: 'paper_compact', name: 'Compacted paper', val: 450 },
  { id: 'food_wet', name: 'Food waste (wet)', val: 700 },
  { id: 'mixed_loose', name: 'Loose mixed waste', val: 130 },
  { id: 'metal_shred', name: 'Shredded metal', val: 1500 },
  { id: 'clothes_loose', name: 'Loose clothes', val: 80 }
];

const QuantitySlider = ({ value, onChange, estimatedKwh = 0 }) => {
  const [activeTab, setActiveTab] = useState('weight'); // 'weight' or 'volume'
  
  // Weight Tab State
  const [inputVal, setInputVal] = useState(value);
  const [unit, setUnit] = useState('kg'); // g, kg, ton

  // Volume Tab State
  const [dimUnit, setDimUnit] = useState('m'); // cm, inch, m
  const [dims, setDims] = useState({ l: '', w: '', h: '' });
  const [densityId, setDensityId] = useState(DENSITIES[0].id);

  // Sync internal input with prop value when it changes externally
  useEffect(() => {
    if (unit === 'kg') setInputVal(value);
    else if (unit === 'g') setInputVal(value * 1000);
    else if (unit === 'ton') setInputVal(value / 1000);
  }, [value, unit]);

  // Handle direct input change
  const handleInputChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setInputVal(val);
    if (unit === 'kg') onChange(val);
    else if (unit === 'g') onChange(val / 1000);
    else if (unit === 'ton') onChange(val * 1000);
  };

  const handleUnitChange = (newUnit) => {
    let currentInKg = value;
    setUnit(newUnit);
    if (newUnit === 'kg') setInputVal(currentInKg);
    else if (newUnit === 'g') setInputVal(currentInKg * 1000);
    else if (newUnit === 'ton') setInputVal(currentInKg / 1000);
  };

  // Slider smart step
  const getStep = (val) => {
    if (val < 10) return 0.1;
    if (val < 1000) return 1;
    return 10;
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    onChange(val); // slider is always in kg
  };

  const quickPicks = [
    { label: '100g', kg: 0.1 },
    { label: '500g', kg: 0.5 },
    { label: '1kg', kg: 1 },
    { label: '10kg', kg: 10 },
    { label: '50kg', kg: 50 },
    { label: '100kg', kg: 100 },
    { label: '1 ton', kg: 1000 }
  ];

  // Volume calculation
  useEffect(() => {
    if (activeTab === 'volume' && dims.l && dims.w && dims.h) {
      let lM = parseFloat(dims.l) || 0;
      let wM = parseFloat(dims.w) || 0;
      let hM = parseFloat(dims.h) || 0;

      // Convert to meters
      if (dimUnit === 'cm') { lM /= 100; wM /= 100; hM /= 100; }
      else if (dimUnit === 'inch') { lM *= 0.0254; wM *= 0.0254; hM *= 0.0254; }

      const volM3 = lM * wM * hM;
      const den = DENSITIES.find(d => d.id === densityId)?.val || 130;
      const kg = volM3 * den;
      
      if (kg > 0) onChange(kg);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims, dimUnit, densityId, activeTab]);

  return (
    <div className="w-full glass-card p-6 mt-6 border border-border shadow-[0_0_20px_rgba(0,0,0,0.3)]">
      {/* Tabs */}
      <div className="flex bg-primary p-1 rounded-lg mb-6 w-full md:w-fit custom-scrollbar">
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
            activeTab === 'weight' ? 'bg-accent text-black shadow' : 'text-text-soft hover:text-white'
          }`}
        >
          <Scale size={16} /> Direct Weight
        </button>
        <button
          onClick={() => setActiveTab('volume')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
            activeTab === 'volume' ? 'bg-accent text-black shadow' : 'text-text-soft hover:text-white'
          }`}
        >
          <BoxIcon size={16} /> By Dimensions
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'weight' ? (
          <motion.div
            key="weight"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-between items-end">
               <div className="flex gap-4 items-end flex-wrap">
                  <div>
                    <label className="text-text-soft font-medium text-sm block mb-2">Quantity</label>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         className="bg-primary border border-border rounded-lg px-4 py-2 text-2xl font-bold text-white w-32 focus:border-accent outline-none"
                         value={inputVal}
                         onChange={handleInputChange}
                       />
                       <select 
                         className="bg-primary border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-accent"
                         value={unit}
                         onChange={(e) => handleUnitChange(e.target.value)}
                       >
                         <option value="g">g</option>
                         <option value="kg">kg</option>
                         <option value="ton">ton</option>
                       </select>
                    </div>
                  </div>
                  <div className="text-sm text-text-soft pb-3 font-mono">
                    = {unit !== 'g' && value < 1 ? (value * 1000).toFixed(0) + ' grams' : value >= 1000 ? (value / 1000).toFixed(2) + ' metric tons' : value.toFixed(2) + ' kg'}
                  </div>
               </div>
               
               {estimatedKwh > 0 && (
                 <div className="text-right hidden sm:block">
                   <div className="text-xs text-text-soft mb-1">Est. Potential</div>
                   <div className="text-accent text-xl font-bold">{Math.round(estimatedKwh).toLocaleString()} kWh</div>
                 </div>
               )}
            </div>

            <div>
               <input 
                 type="range" min="0.001" max="10000" step={getStep(value)} value={value} onChange={handleSliderChange}
                 className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer accent-accent"
               />
               <div className="flex justify-between mt-4 gap-2 overflow-x-auto custom-scrollbar pb-2">
                 {quickPicks.map(bp => (
                   <button
                     key={bp.label}
                     onClick={() => onChange(bp.kg)}
                     className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border max-w-fit flex-shrink-0 ${
                       value === bp.kg ? 'bg-accent/20 text-accent border-accent/50' : 'bg-primary border-border text-text-soft hover:border-text-soft hover:text-white'
                     }`}
                   >
                     {bp.label}
                   </button>
                 ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="volume"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="text-text-soft font-medium text-sm">Dimensions (L × W × H)</label>
                 <select 
                   className="bg-primary border border-border rounded text-xs px-2 py-1 text-white outline-none"
                   value={dimUnit} onChange={e => setDimUnit(e.target.value)}
                 >
                   <option value="cm">Centimeters</option>
                   <option value="inch">Inches</option>
                   <option value="m">Meters</option>
                 </select>
               </div>
               <div className="grid grid-cols-3 gap-3">
                 <input type="number" placeholder="Length" className="bg-primary border border-border rounded-lg px-3 py-2 text-white focus:border-accent outline-none" value={dims.l} onChange={e => setDims({...dims, l: e.target.value})} />
                 <input type="number" placeholder="Width" className="bg-primary border border-border rounded-lg px-3 py-2 text-white focus:border-accent outline-none" value={dims.w} onChange={e => setDims({...dims, w: e.target.value})} />
                 <input type="number" placeholder="Height" className="bg-primary border border-border rounded-lg px-3 py-2 text-white focus:border-accent outline-none" value={dims.h} onChange={e => setDims({...dims, h: e.target.value})} />
               </div>
            </div>

            <div>
               <label className="text-text-soft font-medium text-sm block mb-2">Material Density</label>
               <select 
                 className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-white appearance-none outline-none focus:border-accent"
                 value={densityId} onChange={e => setDensityId(e.target.value)}
               >
                 {DENSITIES.map(d => <option key={d.id} value={d.id}>{d.name} — {d.val} kg/m³</option>)}
               </select>
            </div>

            <div className="bg-primary/50 border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <div className="text-xs text-text-soft mb-1">Volumetric weight calculation — industry standard method</div>
                  <div className="text-sm text-white font-mono break-all">Volume: {(((parseFloat(dims.l)||0)*(parseFloat(dims.w)||0)*(parseFloat(dims.h)||0)) * (dimUnit === 'cm'?0.000001:dimUnit==='inch'?0.000016387:1)).toFixed(3)} m³ × Density: {DENSITIES.find(d=>d.id===densityId)?.val} kg/m³</div>
               </div>
               <div className="text-right whitespace-nowrap">
                  <div className="text-3xl font-heading font-bold text-accent">{value.toFixed(2)} kg</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantitySlider;
