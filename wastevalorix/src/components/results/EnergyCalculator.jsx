import React, { useState } from 'react';
import QuantitySlider from '../analyzer/QuantitySlider';
import { ENERGY_RATES } from '../../constants/wasteData';

const EnergyCalculator = ({ baseKwh, baseCo2, baseBiogas, isOrganic }) => {
  const [liveQty, setLiveQty] = useState(100); // default to 100 on live calc
  
  const liveKwh = liveQty * baseKwh;
  const liveCo2 = liveQty * baseCo2;
  const liveBiogas = liveQty * (baseBiogas || 0);
  const revenue = liveKwh * ENERGY_RATES.electricityRate;
  
  const exportReport = () => {
    const reportText = `WasteValorix Analysis Report\nQuantity: ${liveQty} kg\nEnergy Potential: ${liveKwh.toFixed(2)} kWh\nCO2 Saved: ${liveCo2.toFixed(2)} kg\nEst. Revenue: ₹${revenue.toFixed(2)}\n— RVCE EEE DTL Project`;
    
    if (navigator.share) {
      navigator.share({
        title: 'WasteValorix Report',
        text: reportText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(reportText);
      alert("Report copied to clipboard!");
    }
  };

  return (
    <div className="glass-card mb-8 overflow-hidden">
       <div className="bg-primary p-4 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span className="text-accent">🔢</span> Live Energy Calculator
          </h2>
       </div>
       
       <div className="p-6">
          <QuantitySlider 
            value={liveQty} 
            onChange={setLiveQty} 
          />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="bg-primary/50 p-4 rounded-xl border border-border">
                <div className="text-xs text-text-soft mb-1">Energy Output</div>
                <div className="text-xl font-bold text-accent">{liveKwh.toFixed(1)} <span className="text-sm font-normal">kWh</span></div>
             </div>
             
             <div className="bg-primary/50 p-4 rounded-xl border border-border">
                <div className="text-xs text-text-soft mb-1">CO₂ Saved</div>
                <div className="text-xl font-bold text-teal">{liveCo2.toFixed(1)} <span className="text-sm font-normal">kg</span></div>
             </div>
             
             <div className="bg-primary/50 p-4 rounded-xl border border-border">
                <div className="text-xs text-text-soft mb-1">Revenue Estimate</div>
                <div className="text-xl font-bold text-green-400">₹{revenue.toFixed(0)}</div>
             </div>
             
             {isOrganic && baseBiogas > 0 ? (
               <div className="bg-primary/50 p-4 rounded-xl border border-border">
                  <div className="text-xs text-text-soft mb-1">Biogas Volume</div>
                  <div className="text-xl font-bold text-amber">{liveBiogas.toFixed(2)} <span className="text-sm font-normal">m³</span></div>
               </div>
             ) : (
               <div className="bg-primary/50 p-4 rounded-xl border border-border flex items-center justify-center opacity-50">
                  <span className="text-xs text-text-muted">Biogas N/A</span>
               </div>
             )}
          </div>
          
          <button 
             onClick={exportReport}
             className="w-full mt-6 btn-ghost flex justify-center items-center gap-2"
          >
             Export Report
          </button>
       </div>
    </div>
  );
};

export default EnergyCalculator;
