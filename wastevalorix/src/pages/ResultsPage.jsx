import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Leaf, Trees, Home, Settings, RefreshCw, Save, Share2 } from 'lucide-react';

import Badge from '../components/ui/Badge';
import MetricCard from '../components/ui/MetricCard';
import EnergyBar from '../components/ui/EnergyBar';
import PricingSection from '../components/results/PricingSection';
import EnergyCalculator from '../components/results/EnergyCalculator';
import ComparisonChart from '../components/results/ComparisonChart';
import CO2Impact from '../components/results/CO2Impact';
import RecommendationCard from '../components/results/RecommendationCard';

import { useHistory } from '../hooks/useHistory';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveAnalysis } = useHistory();
  
  const result = location.state?.result;
  const [qty, setQty] = useState(result?.quantity || 100);

  // Save to history on first proper mount if we have results
  useEffect(() => {
    if (result) {
      saveAnalysis(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '60vh', gap: 16, textAlign: 'center'
      }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ fontSize: 18, color: '#00E676' }}>
          No analysis data found
        </div>
        <div style={{ fontSize: 13, color: '#7A9A80' }}>
          Please run an analysis first
        </div>
        <button onClick={() => navigate('/analyze')}
          style={{ 
            marginTop: 16, padding: '12px 28px',
            background: '#00E676', color: '#000',
            border: 'none', borderRadius: 12,
            fontWeight: 700, cursor: 'pointer'
          }}>
          Go to Analyze
        </button>
      </div>
    );
  }

  const {
    wasteType = 'Unknown Material', category = 'Mixed', method = 'Thermal Processing', 
    methodDetail = 'Processing technology not fully identified.', 
    kwhPerKg = 0, co2PerKg = 0, confidence = 0, emoji = '♻️', 
    description = 'No specific description available.', efficiency = 0, 
    tips, didYouKnow = '', biogasM3PerKg = 0,
    quantity = 0, source = 'manual', color = '#00E676'
  } = result;

  const safeCategory = category || 'Mixed';
  const safeTips = Array.isArray(tips) ? tips : (typeof tips === 'string' ? [tips] : []);

  const handleShare = () => {
    const text = `WasteValorix Analysis Report\nWaste: ${wasteType} | Quantity: ${quantity}kg\nEnergy: ${(quantity * kwhPerKg).toFixed(1)} kWh | CO₂ Saved: ${(quantity * co2PerKg).toFixed(1)} kg\nMethod: ${method}\n— RVCE EEE DTL Project`;
    
    if (navigator.share) {
      navigator.share({ title: 'WasteValorix Report', text }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8">
       {/* Section 1: Top Identity Card */}
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="relative glass-card overflow-hidden p-6 md:p-8 mb-8"
       >
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
         
         <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
            <div className="text-7xl bg-card border border-border p-4 rounded-3xl shadow-lg">
              {emoji}
            </div>
            
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-2 flex-wrap">
                 <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white">{wasteType}</h1>
                 {source === 'ai' && (
                   <span className="bg-text-muted/30 text-white border border-border text-xs px-2 py-1 rounded-md font-semibold">
                      🧠 AI Identified · {confidence}% Confidence
                   </span>
                 )}
               </div>
               
               <Badge variant={safeCategory.toLowerCase()} className="mb-4 text-sm px-3 py-1">
                 {safeCategory} Matrix
               </Badge>
               
               <p className="text-text-primary text-sm md:text-base leading-relaxed max-w-2xl">
                 {description}
               </p>
            </div>
         </div>
       </motion.div>

       {/* Section 2: 4 Metric Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <MetricCard 
           title="Total Energy" 
           value={quantity * kwhPerKg} 
           unit="kWh" 
           icon={Zap} 
           color={color}
           delay={1}
         />
         <MetricCard 
           title="CO₂ Saved" 
           value={quantity * co2PerKg} 
           unit="kg" 
           icon={Leaf} 
           color="#00BCD4"
           delay={2}
         />
         <MetricCard 
           title="Trees Saved" 
           value={(quantity * co2PerKg) / 21} 
           unit="trees/yr" 
           icon={Trees} 
           color="#8BC34A"
           delay={3}
         />
         <MetricCard 
           title="Homes Powered" 
           value={(quantity * kwhPerKg) / 3.5} 
           unit="days" 
           icon={Home} 
           color="#FFC107"
           delay={4}
         />
       </div>

       {/* Section 3: Tech & Chart */}
       <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
             className="glass-card p-6 flex flex-col justify-between"
          >
             <div>
                <div className="flex items-center gap-2 text-text-soft font-semibold text-sm mb-4">
                  <Settings size={18} /> Best Conversion Technology
                </div>
                <h3 className="text-2xl font-heading font-bold text-accent mb-3">{method}</h3>
                <p className="text-text-primary mb-6 text-sm leading-relaxed">{methodDetail}</p>
             </div>
             <div>
                <EnergyBar label="Process Efficiency" percentage={efficiency} color={color} />
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
             <h3 className="text-lg font-heading font-bold text-white mb-2">Energy Yield Comparison</h3>
             <ComparisonChart currentWasteType={wasteType} />
          </motion.div>
       </div>

       {/* Sub Components Sections */}
       <PricingSection result={result} quantity={qty} />
       
       <EnergyCalculator 
          baseKwh={kwhPerKg} 
          baseCo2={co2PerKg} 
          baseBiogas={biogasM3PerKg} 
          isOrganic={safeCategory.toLowerCase() === 'organic' || safeCategory.toLowerCase() === 'lignocellulosic'} 
          liveQty={qty}
          setLiveQty={setQty}
       />

       <motion.div 
         initial={{ opacity: 0, y: 20 }} 
         whileInView={{ opacity: 1, y: 0 }} 
         viewport={{ once: true }}
         className="mb-12"
       >
         <h3 className="text-xl font-heading font-bold text-white border-b border-border pb-2">Environmental Impact Validation</h3>
         <CO2Impact co2Saved={quantity * co2PerKg} />
       </motion.div>

       <div className="mb-12">
         <h3 className="text-xl font-heading font-bold text-white border-b border-border pb-2">AI Expert Insights</h3>
         <RecommendationCard tips={safeTips} fact={didYouKnow} />
       </div>

       {/* Bottom Actions */}
       <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8 border-t border-border pt-8">
          <button onClick={() => navigate('/analyze')} className="btn-primary flex items-center justify-center gap-2">
            <RefreshCw size={18} /> Analyze Another Waste
          </button>
          <button onClick={handleShare} className="btn-ghost flex items-center justify-center gap-2">
            <Share2 size={18} /> Share Results
          </button>
          <button onClick={() => navigate('/history')} className="btn-ghost flex items-center justify-center gap-2 border-transparent hover:border-transparent text-text-soft bg-card">
            <Save size={18} /> View History
          </button>
       </div>

    </div>
  );
};

export default ResultsPage;
