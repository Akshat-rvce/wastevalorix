import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WASTE_TYPES } from '../../constants/wasteData';

const ComparisonChart = ({ currentWasteType }) => {
  
  const chartData = useMemo(() => {
    return WASTE_TYPES.map(w => ({
      name: w.name.split('/')[0].trim(), // Simplify names for the axis
      kwh: w.kwhPerKg,
      isCurrent: w.name === currentWasteType || w.id === currentWasteType,
      color: w.color
    })).sort((a, b) => b.kwh - a.kwh);
  }, [currentWasteType]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border px-3 py-2 rounded-lg shadow-xl">
          <p className="font-semibold text-white">{payload[0].payload.name}</p>
          <p className="text-accent">{payload[0].value.toFixed(2)} kWh/kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#7A9A80', fontSize: 12 }} 
            width={100}
          />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
          <Bar dataKey="kwh" radius={[0, 4, 4, 0]} animationDuration={1500}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#00E676' : '#3D5C42'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
