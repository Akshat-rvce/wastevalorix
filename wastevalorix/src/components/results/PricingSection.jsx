import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, AlertCircle, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const useCountUp = (end, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId = null;
    const initialCount = count;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(initialCount + progress * (end - initialCount));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    
    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration]);

  return count;
};

const QualityGauge = ({ score, grade, assessment }) => {
  const animatedScore = useCountUp(score);
  
  let color = '#00E676';
  if (score <= 40) color = '#FF5252';
  else if (score <= 60) color = '#FFC107';
  else if (score <= 80) color = '#8BC34A';
  else color = '#00BCD4';

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r={radius} stroke="#1A2E20" strokeWidth="12" fill="none" />
          <motion.circle 
            cx="80" cy="80" r={radius} 
            stroke={color} strokeWidth="12" fill="none" strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="text-center">
          <div className="text-4xl font-bold text-white flex items-baseline justify-center">
            {Math.round(animatedScore)}<span className="text-xl ml-1">{grade}</span>
          </div>
          <div className="text-xs text-text-soft mt-1">Quality Score</div>
        </div>
      </div>
      <div className="text-sm text-center text-text-primary italic mt-4">{assessment}</div>
    </div>
  );
};

const AnimatedBar = ({ label, value, invert = false, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  let color = '#00E676';
  if (invert) {
    if (value > 70) color = '#FF5252';
    else if (value > 40) color = '#FFC107';
  } else {
    if (value < 40) color = '#FF5252';
    else if (value < 70) color = '#FFC107';
  }

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-primary flex items-center gap-2">
          {label} {invert && <span className="text-[10px] text-text-muted">(Lower is better)</span>}
        </span>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="h-2 w-full bg-[#1A2E20] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-[1200ms] ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const PricingSection = ({ result, quantity = 100 }) => {
  const navigate = useNavigate();

  if (!result || !result.pricing) {
    return null;
  }

  const { qualityScore, qualityGrade, qualityAssessment, conditionFactors, pricing } = result;

  const minTotal = useCountUp(pricing.yourPriceMin * quantity);
  const maxTotal = useCountUp(pricing.yourPriceMax * quantity);

  const rangeDiff = pricing.premiumPrice - pricing.scrapDealerPrice;
  const minPos = Math.max(0, Math.min(100, ((pricing.yourPriceMin - pricing.scrapDealerPrice) / rangeDiff) * 100));
  const maxPos = Math.max(0, Math.min(100, ((pricing.yourPriceMax - pricing.scrapDealerPrice) / rangeDiff) * 100));
  const bracketWidth = Math.max(5, maxPos - minPos);

  const getTier = () => {
    const avgPos = (minPos + maxPos) / 2;
    if (avgPos < 25) return "Bottom 25%";
    if (avgPos < 50) return "Mid Market";
    if (avgPos < 75) return "Top Tier";
    return "Premium";
  };

  return (
    <div className="w-full mt-8 mb-8" id="pricing-section">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">💰</div>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Market Price Intelligence
            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full flex items-center gap-1 border border-accent/30 font-semibold">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Live Market Data
            </span>
          </h2>
          <p className="text-sm text-text-soft">AI-assessed pricing based on waste quality & current Indian market rates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="glass-card p-6 border border-accent/10 flex items-center justify-center col-span-1">
          <QualityGauge score={qualityScore} grade={qualityGrade} assessment={qualityAssessment} />
        </div>

        <div className="glass-card p-6 border border-accent/10 bg-gradient-to-br from-[#0A1A0D] to-[#122A17] col-span-1 md:col-span-2 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center z-10">
            <div>
              <div className="text-sm text-text-soft mb-1">Your estimated price range</div>
              <div className="text-3xl md:text-5xl font-black bg-gradient-to-r from-[#00E676] to-[#00BCD4] text-transparent bg-clip-text mb-2">
                ₹{pricing.yourPriceMin} — ₹{pricing.yourPriceMax} <span className="text-xl font-normal text-white">{pricing.unit}</span>
              </div>
              <div className="text-lg text-amber font-semibold">
                For {quantity}kg total: ₹{Math.round(minTotal).toLocaleString()} — ₹{Math.round(maxTotal).toLocaleString()}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${pricing.trend === 'rising' ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-[#FF5252]/20 text-[#FF5252]'}`}>
                {pricing.trend === 'rising' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {pricing.trend === 'rising' ? '+' : '-'}{pricing.trendPercentage}% vs {pricing.trendPeriod}
              </div>
              <div className="text-xs text-text-muted mt-2 max-w-[200px] leading-tight">
                {pricing.trendReason}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-4 border border-accent/10 bg-[#0A1A0D]">
        <h3 className="text-white font-bold mb-8">Price Market Position</h3>
        <div className="relative h-2 w-full bg-gradient-to-r from-[#FF5252] via-[#FFC107] to-[#00E676] rounded-full mb-8">
          <div className="absolute top-4 left-0 -translate-x-1/2 flex flex-col items-center">
            <div className="w-0.5 h-3 bg-[#FF5252] mb-1"></div>
            <div className="text-xs text-[#FF5252] font-bold whitespace-nowrap">Scrap Dealer</div>
            <div className="text-xs text-text-muted">₹{pricing.scrapDealerPrice}/kg</div>
          </div>
          
          <div className="absolute top-4 right-0 translate-x-1/2 flex flex-col items-center">
            <div className="w-0.5 h-3 bg-[#00E676] mb-1"></div>
            <div className="text-xs text-[#00E676] font-bold whitespace-nowrap">Premium Grade</div>
            <div className="text-xs text-text-muted">₹{pricing.premiumPrice}/kg</div>
          </div>

          <motion.div 
            className="absolute top-0 h-2 bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.8)] border-y border-[#00E676]"
            initial={{ left: 0, width: 0 }}
            animate={{ left: `${minPos}%`, width: `${bracketWidth}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.div 
            className="absolute -top-10 flex flex-col items-center"
            initial={{ left: 0, opacity: 0 }}
            animate={{ left: `${minPos + bracketWidth/2}%`, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            style={{ transform: 'translateX(-50%)' }}
          >
            <div className="bg-[#0A1A0D] border border-[#00E676] text-[#00E676] text-xs font-bold px-2 py-1 rounded shadow-[0_0_8px_rgba(0,230,118,0.4)] whitespace-nowrap">
              YOUR WASTE · ₹{pricing.yourPriceMin}-{pricing.yourPriceMax}/kg
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#00E676]"></div>
          </motion.div>
        </div>
        <div className="text-center text-sm text-text-soft mt-10">
          You are in the <strong className="text-white">{getTier()}</strong> price tier
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-6 border border-accent/10">
          <h3 className="text-white font-bold mb-4">Quality Conditions</h3>
          <AnimatedBar label="Cleanliness" value={conditionFactors.cleanliness} delay={100} />
          <AnimatedBar label="Contamination" value={conditionFactors.contamination} invert={true} delay={250} />
          <AnimatedBar label="Moisture" value={conditionFactors.moisture} invert={true} delay={400} />
          <AnimatedBar label="Sorting Quality" value={conditionFactors.sorting} delay={550} />
          <AnimatedBar label="Size Uniformity" value={conditionFactors.size_uniformity} delay={700} />
        </div>

        <div className="glass-card p-6 border border-accent/10">
          <h3 className="text-white font-bold mb-4">What's affecting your price</h3>
          <div className="flex flex-col gap-3">
            {pricing.priceFactors.map((f, i) => {
              const isPos = f.impact === 'positive';
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * i }}
                  className={`bg-[#0A1A0D] border border-border p-3 rounded-lg border-l-4 ${isPos ? 'border-l-[#00E676]' : 'border-l-[#FF5252]'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-sm flex items-center gap-2">
                      {isPos ? <ArrowUpRight size={16} className="text-[#00E676]" /> : <ArrowDownRight size={16} className="text-[#FF5252]" />}
                      {f.factor}
                    </span>
                    <span className={`font-bold ${isPos ? 'text-[#00E676]' : 'text-[#FF5252]'}`}>{f.value}</span>
                  </div>
                  <div className="h-1 w-full bg-[#1A2E20] rounded-full mt-2">
                    <div className={`h-full rounded-full ${isPos ? 'bg-[#00E676]' : 'bg-[#FF5252]'}`} style={{ width: `${Math.abs(f.percentage)}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-6 border border-accent/10 overflow-hidden">
          <h3 className="text-white font-bold mb-4">Price by quantity (volume discount)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-text-soft">
                  <th className="pb-2 font-medium">Quantity</th>
                  <th className="pb-2 font-medium">Price/kg</th>
                  <th className="pb-2 font-medium text-right">Savings</th>
                </tr>
              </thead>
              <tbody>
                {pricing.quantityBreakpoints.map((bp, i) => {
                  let isCurrent = false;
                  if (bp.qty.includes('+')) {
                    const min = parseInt(bp.qty);
                    if (quantity >= min) isCurrent = true;
                  } else {
                    const [min, max] = bp.qty.replace(' kg','').split('-');
                    if (quantity >= parseInt(min) && quantity <= parseInt(max)) isCurrent = true;
                  }
                  
                  const savings = i === 0 ? "Base" : i === 1 ? "+25%" : i === 2 ? "+60%" : "+120% ⭐";

                  return (
                    <tr key={i} className={`border-b border-border/50 ${isCurrent ? 'bg-accent/10 border-l-2 border-l-accent' : ''}`}>
                      <td className={`py-3 px-2 ${isCurrent ? 'text-white font-bold' : 'text-text-primary'}`}>{bp.qty}</td>
                      <td className={`py-3 ${isCurrent ? 'text-[#00E676] font-bold' : 'text-text-primary'}`}>{bp.price}</td>
                      <td className="py-3 text-right text-amber font-semibold pr-2">{savings}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {quantity < 100 && (
            <div className="mt-4 text-sm bg-amber/10 text-amber p-3 rounded-lg flex items-center gap-2 border border-amber/20">
              💡 You could earn better rates by collecting 100kg+
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-card p-4 border border-accent/10 flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-bold text-sm">Price trend (6 months)</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${pricing.trend === 'rising' ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-[#FF5252]/20 text-[#FF5252]'}`}>
                {pricing.trend === 'rising' ? '↑' : '↓'} {pricing.trendPercentage}% Past 3 months
              </span>
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pricing.priceHistory}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0A1A0D', border: '1px solid #1A2E20', borderRadius: '8px' }}
                    itemStyle={{ color: '#00E676', fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value}/kg`, 'Price']}
                    labelStyle={{ color: '#A0AEC0' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#00E676" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-4 border border-l-4 border-amber/30 border-l-amber bg-[#0A1A0D]">
            <h3 className="text-amber font-bold mb-2 flex items-center gap-2 text-sm"><AlertCircle size={16}/> Get a better price</h3>
            <ul className="text-sm text-text-primary space-y-1.5 pl-5 list-disc">
              {pricing.negotiationTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-4 border border-accent/10">
        <div className="mb-4">
          <h3 className="text-white font-bold">Prices across Indian cities</h3>
          <p className="text-xs text-text-soft">Your location may affect final price</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {pricing.nearbyMarketPrices.map((city, i) => {
            const maxPrice = Math.max(...pricing.nearbyMarketPrices.map(c => c.price));
            const w = (city.price / maxPrice) * 100;
            let dColor = '#FFC107'; // Med
            if (city.demand === 'Very High') dColor = '#00E676';
            else if (city.demand === 'High') dColor = '#8BC34A';
            else if (city.demand === 'Low') dColor = '#FF5252';

            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-20 text-sm text-text-primary truncate">{city.city}</div>
                <div className="flex-1 h-3 bg-[#1A2E20] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${w}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: dColor }}
                  />
                </div>
                <div className="text-sm font-bold text-white w-16 text-right">₹{city.price}</div>
                <div className="w-20 text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: `${dColor}20`, color: dColor }}>
                    {city.demand}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-4 mb-4 border border-accent/20 bg-gradient-to-r from-[#0A1A0D] to-[#122A17] flex flex-col md:flex-row justify-between items-center text-sm shadow-[0_0_15px_rgba(0,230,118,0.05)]">
        <div className="flex items-center gap-2 text-white font-bold mb-2 md:mb-0">
          <Calendar className="text-accent" size={18} /> Best time to sell:
        </div>
        <div className={`font-semibold ${pricing.bestTimeToSell.includes('Now') ? 'text-[#00E676] drop-shadow-[0_0_5px_rgba(0,230,118,0.5)]' : 'text-amber'}`}>
          {pricing.bestTimeToSell}
        </div>
      </div>

      <div className="glass-card p-8 border border-accent/30 bg-[#0A1A0D] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent pointer-events-none" />
        <h3 className="text-text-primary mb-2">Your {quantity}kg of {result.wasteType} is worth</h3>
        <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#00E676] to-[#00BCD4] text-transparent bg-clip-text mb-6">
          ₹{Math.round(minTotal).toLocaleString()} — ₹{Math.round(maxTotal).toLocaleString()}
        </div>
        <p className="text-text-soft mb-6">Find buyers who'll pay this in your area →</p>
        <button 
          onClick={() => navigate('/marketplace', { state: { filterFromResults: true, resultData: result } })}
          className="bg-accent hover:bg-accent/90 text-black font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto transition-transform hover:scale-105"
        >
          Open Marketplace <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default PricingSection;
