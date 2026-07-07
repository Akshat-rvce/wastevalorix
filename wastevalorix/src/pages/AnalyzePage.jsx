import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, ListChecks, Camera } from 'lucide-react';
import ImageUploader from '../components/analyzer/ImageUploader';
import LiveCameraScanner from '../components/analyzer/LiveCameraScanner';
import ManualSelector from '../components/analyzer/ManualSelector';
import QuantitySlider from '../components/analyzer/QuantitySlider';
import LoadingScreen from '../components/ui/LoadingScreen';
import { useAnalysis } from '../hooks/useAnalysis';
import { WASTE_TYPES } from '../constants/wasteData';

const AnalyzePage = () => {
  const navigate = useNavigate();
  // Default to 'camera' since it's the requested main feature
  const [activeTab, setActiveTab] = useState('camera'); 
  const [countdown, setCountdown] = useState(0);
  
  const {
    imageSrc,
    imageFile,
    selectedWaste,
    quantity,
    loading,
    error,
    setError,
    results,
    handleImageUpload,
    handleCameraCapture,
    setSelectedWaste,
    setQuantity,
    handleAnalyze,
    resetAnalysis
  } = useAnalysis();

  useEffect(() => {
    if (error && error.toLowerCase().includes('wait')) {
      setCountdown(60);
    } else {
      setCountdown(0);
    }
  }, [error]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, setError]);

  const estimatedKwhPreview = () => {
    if (selectedWaste) {
      const wasteInfo = WASTE_TYPES.find(w => w.id === selectedWaste);
      return wasteInfo ? wasteInfo.kwhPerKg * quantity : 0;
    }
    return 0;
  };

  const isAnalyzeDisabled = loading || ((activeTab === 'image' || activeTab === 'camera') && !imageSrc) || (activeTab === 'manual' && !selectedWaste);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {loading && <LoadingScreen />}

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Analyze Waste</h1>
        <p className="text-text-soft">Live track, upload a photo or select manually for complete energy diagnostics.</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-card rounded-full mb-8 relative border border-border w-full md:w-fit custom-scrollbar overflow-x-auto">
        {['camera', 'image', 'manual'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[140px] relative py-2.5 px-4 text-sm font-semibold rounded-full transition-colors z-10 flex items-center justify-center gap-2 ${
              activeTab === tab ? 'text-bg-primary' : 'text-text-soft hover:text-white'
            }`}
          >
            {tab === 'camera' && <Camera size={16} />}
            {tab === 'image' && <ImageIcon size={16} />}
            {tab === 'manual' && <ListChecks size={16} />}
            
            {tab === 'camera' ? 'Live Camera' : tab === 'image' ? 'Upload Photo' : 'Select Manually'}
            
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-accent rounded-full -z-10 shadow-[0_0_15px_#00E676]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          background: 'rgba(255,82,82,0.1)',
          border: '1px solid rgba(255,82,82,0.4)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '16px',
          color: '#FF5252',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{fontSize: '20px'}}>⚠️</span>
          <div style={{flex: 1}}>
            <div style={{fontWeight: 700, marginBottom: 4}}>Analysis Failed</div>
            <div style={{opacity: 0.85}}>
              {countdown > 0 ? `⏳ Cooling down... try again in ${countdown} seconds` : error}
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="mb-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'camera' && (
             <motion.div
               key="camera"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               transition={{ duration: 0.2 }}
             >
               {imageSrc ? (
                 <div className="relative rounded-cards overflow-hidden">
                   <img src={imageSrc} alt="Captured" className="w-full max-h-80 object-cover" />
                   <div className="absolute top-4 left-4">
                     <button onClick={resetAnalysis} className="btn-ghost backdrop-blur-md bg-black/50 hover:bg-black/80">Retake</button>
                   </div>
                   <div className="absolute bottom-4 left-4 backdrop-blur-md bg-black/50 px-3 py-1 text-accent rounded-full text-xs font-bold border border-accent/20">
                     TARGET LOCKED
                   </div>
                 </div>
               ) : (
                 <LiveCameraScanner 
                   onCapture={(base64, type) => handleCameraCapture(base64, type)} 
                 />
               )}
             </motion.div>
          )}

          {activeTab === 'image' && (
            <motion.div
              key="image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ImageUploader 
                imageSrc={imageSrc} 
                imageFile={imageFile}
                onUpload={handleImageUpload} 
                onClear={resetAnalysis}
              />
            </motion.div>
          )}

          {activeTab === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
               <ManualSelector 
                 selectedIds={selectedWaste ? [selectedWaste] : []}
                 onSelect={(id) => setSelectedWaste(id)}
               />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <QuantitySlider 
        value={quantity} 
        onChange={setQuantity} 
        estimatedKwh={estimatedKwhPreview()}
      />

      <div className="mt-8">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzeDisabled}
          className={`w-full py-4 rounded-xl font-heading font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isAnalyzeDisabled 
              ? 'bg-card border border-border text-text-muted cursor-not-allowed'
              : 'bg-accent hover:bg-accent-dark text-bg-primary shadow-[0_0_30px_rgba(0,230,118,0.3)]'
          }`}
        >
          🔬 Analyze Now
        </button>
      </div>
      
    </div>
  );
};

export default AnalyzePage;
