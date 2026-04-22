import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink, Calendar, Zap, Leaf, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory } from '../hooks/useHistory';

const HistoryPage = () => {
  const { history, getHistory, deleteEntry, clearAll } = useHistory();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const totalKg = history.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalKwh = history.reduce((sum, item) => sum + ((item.quantity || 0) * (item.kwhPerKg || 0)), 0);
  const totalCo2 = history.reduce((sum, item) => sum + ((item.quantity || 0) * (item.co2PerKg || 0)), 0);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Analysis History</h1>
          <p className="text-text-soft">Your past waste-to-energy diagnostics.</p>
        </div>
        {history.length > 0 && (
          <button 
             onClick={() => setShowConfirm(true)}
             className="text-danger hover:text-white hover:bg-danger/80 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur">
          <div className="bg-card p-6 rounded-2xl border border-danger/50 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-2">Clear History?</h3>
            <p className="text-text-soft text-sm mb-6">This action cannot be undone. All your saved diagnostic reports will be deleted.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={() => { clearAll(); setShowConfirm(false); }}
                className="flex-1 bg-danger hover:bg-red-600 text-white font-bold py-3 px-4 rounded-buttons transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="bg-primary p-6 rounded-full mb-4">
             <Calendar size={48} className="text-text-muted opacity-50" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-white mb-2">No analyses yet</h3>
          <p className="text-text-soft mb-6 max-w-md">You haven't scanned or calculated any waste profiles yet. Start your first scan to see results here.</p>
          <button onClick={() => navigate('/analyze')} className="btn-primary">
            Start First Scan
          </button>
        </div>
      ) : (
        <>
          {/* Top Level Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
             <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-card p-3 rounded-lg"><Trash2 className="text-accent" /></div>
                <div>
                  <div className="text-sm font-semibold text-text-soft">Total Analyzed</div>
                  <div className="text-xl font-bold text-white">{totalKg.toLocaleString()} kg</div>
                </div>
             </div>
             <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-card p-3 rounded-lg"><Zap className="text-blue-400" /></div>
                <div>
                  <div className="text-sm font-semibold text-text-soft">Total Energy Recoveria</div>
                  <div className="text-xl font-bold text-white">{Math.round(totalKwh).toLocaleString()} kWh</div>
                </div>
             </div>
             <div className="bg-teal-900/20 border border-teal-500/20 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-card p-3 rounded-lg"><Leaf className="text-teal-400" /></div>
                <div>
                  <div className="text-sm font-semibold text-text-soft">Total CO₂ Saved</div>
                  <div className="text-xl font-bold text-white">{Math.round(totalCo2).toLocaleString()} kg</div>
                </div>
             </div>
          </div>

          <AnimatePresence>
            <div className="space-y-4">
               {history.map((item, idx) => (
                  <motion.div 
                     key={item.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ delay: idx * 0.05 }}
                     className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                     <div className="flex items-center gap-4">
                        <div className="text-3xl bg-primary p-2 rounded-lg">{item.emoji}</div>
                        <div>
                           <h4 className="font-heading font-bold text-white text-lg">{item.wasteType}</h4>
                           <div className="text-xs text-text-soft flex items-center gap-2">
                             <span>{formatDate(item.timestamp)}</span>
                             <span className="w-1 h-1 bg-border rounded-full" />
                             <span>{item.quantity} kg</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between md:justify-end gap-6 bg-primary/50 md:bg-transparent p-3 md:p-0 rounded-lg">
                        <div className="text-right">
                           <div className="text-accent font-bold">{(item.quantity * item.kwhPerKg).toFixed(1)} kWh</div>
                           <div className="text-teal text-xs">{(item.quantity * item.co2PerKg).toFixed(1)} kg CO₂</div>
                        </div>
                        
                        <div className="flex gap-2">
                           <button 
                             onClick={() => navigate('/marketplace')}
                             className="p-2 bg-card border border-border rounded-md hover:bg-amber/10 hover:border-amber text-amber transition-colors"
                             title="Find Buyers"
                           >
                             <Store size={18} />
                           </button>
                           <button 
                             onClick={() => navigate('/results', { state: { result: item } })}
                             className="p-2 bg-card border border-border rounded-md hover:bg-accent/10 hover:border-accent text-white transition-colors"
                             title="View Report"
                           >
                             <ExternalLink size={18} />
                           </button>
                           <button 
                             onClick={() => deleteEntry(item.id)}
                             className="p-2 bg-card border border-border rounded-md hover:bg-danger/20 hover:border-danger hover:text-danger text-text-soft transition-colors"
                             title="Delete record"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
