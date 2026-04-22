import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, TrendingUp, Filter, Search, IndianRupee, ArrowRight, ShieldCheck, Mail, Phone, Factory, MapPin } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';

const MarketplacePage = () => {
  const { history, loading, getHistory } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  // Aggregate all unique buyers from all history items
  const allListings = history.flatMap(item => {
    const itemBuyers = Array.isArray(item.buyers) ? item.buyers : [];
    return itemBuyers.map(buyer => ({
      ...buyer,
      analysisId: item.id,
      wasteType: item.wasteType || item.waste_type || 'Unknown Waste',
      quantity: item.quantity || item.quantity_kg || 1,
      emoji: item.emoji || '♻️',
      date: item.timestamp,
      marketValuePerKg: item.marketValuePerKg || item.market_value_per_kg || 0,
      sourceItem: item
    }));
  });

  const uniqueCategories = ['All', ...new Set(allListings.map(b => b.buyerType || 'General'))];

  const filteredListings = allListings.filter(listing => {
    const searchLow = searchTerm.toLowerCase();
    const wType = (listing.wasteType || '').toLowerCase();
    const bType = (listing.buyerType || '').toLowerCase();
    const bName = (listing.buyerName || '').toLowerCase();

    const matchesSearch = wType.includes(searchLow) || bType.includes(searchLow) || bName.includes(searchLow);
    const matchesCategory = filterCategory === 'All' || listing.buyerType === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 flex items-center gap-3">
            <Store className="text-accent" size={36} /> B2B Marketplace
          </h1>
          <p className="text-text-soft">Connect your analyzed waste streams with verified industrial buyers.</p>
        </div>
        
        <div className="flex bg-card border border-border p-3 rounded-2xl gap-8 shadow-lg">
          <div>
            <div className="text-xs text-text-soft uppercase font-semibold mb-1">Total Value Detected</div>
            <div className="text-2xl font-bold text-amber flex items-center">
              <IndianRupee size={20} />
              {history.reduce((acc, curr) => acc + (curr.quantity * (curr.marketValuePerKg || 0)), 0).toLocaleString()}
            </div>
          </div>
          <div className="w-px bg-border"></div>
          <div>
            <div className="text-xs text-text-soft uppercase font-semibold mb-1">Active Buyers Found</div>
            <div className="text-2xl font-bold text-white">
              {new Set(allListings.map(b => b.buyerType)).size}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card mb-8 p-4 flex flex-col md:flex-row gap-4 relative z-20">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search by waste type or buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent focus:outline-none transition-colors"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-xl py-3 pl-12 pr-10 text-white focus:border-accent focus:outline-none appearance-none cursor-pointer transition-colors"
          >
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center p-16 glass-card border-dashed">
          <TrendingUp size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Market Opportunities Found</h3>
          <p className="text-text-soft max-w-md mx-auto">
            You need to scan and analyze waste streams first. The AI will automatically identify potential buyers for your specific materials.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {filteredListings.map((listing, idx) => (
            <motion.div
              key={`${listing.analysisId}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card hover:border-accent/50 transition-all flex flex-col h-full bg-bg-secondary/40 backdrop-blur-md overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-3">
                <ShieldCheck className="text-accent/40" size={40} />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
                    <Factory size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight line-clamp-1" title={listing.buyerName || listing.buyerType}>{listing.buyerName || listing.buyerType}</h3>
                    <div className="text-xs text-text-soft flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                      Verified {listing.buyerType}
                    </div>
                    {listing.location && (
                      <div className="text-xs text-text-muted mt-2 truncate flex items-center gap-1">
                        <MapPin size={12} className="text-accent" /> {listing.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-card/50 border border-border rounded-lg p-3 mb-4 text-sm mt-auto">
                  <div className="text-text-soft mb-1 font-semibold flex items-center justify-between">
                    <span>Target Material</span>
                    <span className="text-xl">{listing.emoji}</span>
                  </div>
                  <div className="text-white font-medium mb-1 truncate">{listing.wasteType}</div>
                  <div className="text-accent font-bold">
                    Est. Value: ₹{listing.priceRangeMin} - ₹{listing.priceRangeMax} {listing.unit}
                  </div>
                </div>

                <p className="text-sm text-text-primary italic border-l-2 border-accent/50 pl-3 mb-4 line-clamp-2">
                  "{listing.notes || 'Interested in bulk quantities. Quality standards apply.'}"
                </p>

                <div className="mt-auto flex gap-2">
                  <button className="flex-1 bg-white flex items-center justify-center text-black font-bold py-2.5 rounded-lg hover:bg-gray-200 transition-colors shadow-button-glow">
                    Request Quote
                  </button>
                  <button className="p-2.5 border border-border bg-card rounded-lg hover:bg-white/10 text-white transition-colors group relative" title={`Contact ${listing.contact || 'Email'}`}>
                    <Mail size={18} className="group-hover:text-accent transition-colors" />
                  </button>
                  <button className="p-2.5 border border-border bg-card rounded-lg hover:bg-white/10 text-white transition-colors group relative" title={`Call ${listing.contact || 'Buyer'}`}>
                    <Phone size={18} className="group-hover:text-accent transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
