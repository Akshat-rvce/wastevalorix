import React, { useRef } from 'react';
import { UploadCloud, Camera, X } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageUploader = ({ onUpload, imageSrc, onClear }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="w-full">
      {!imageSrc ? (
        <div 
          className="relative w-full h-64 border-2 border-dashed border-border-mid hover:border-accent rounded-cards bg-card hover:bg-card-hover transition-all flex flex-col items-center justify-center p-6 text-center group cursor-pointer"
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-4 bg-primary rounded-full mb-4 group-hover:scale-110 transition-transform shadow-card-glow">
            <UploadCloud size={32} className="text-accent" />
          </div>
          <h3 className="text-white font-medium mb-1">Tap to upload or drag & drop</h3>
          <p className="text-text-soft text-sm mb-4">Supports JPG, PNG, WEBP &middot; Max 10MB</p>
          
          {/* Hidden inputs */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <input 
            type="file" 
            ref={cameraInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            capture="environment"
            className="hidden" 
          />

          <button 
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="md:hidden flex items-center gap-2 btn-ghost py-2 px-4 shadow-none border-border"
          >
            <Camera size={18} />
            Use Camera
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full rounded-cards overflow-hidden bg-black border border-border group"
        >
          <img src={imageSrc} alt="Waste preview" className="w-full h-64 object-cover md:object-contain relative z-0" />
          
          {/* AI Scanner Effect Container */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-cards">
             {/* Sweeping Laser Line */}
             <motion.div 
               className="w-full h-8 bg-gradient-to-b from-transparent via-accent/50 to-transparent border-t border-accent drop-shadow-[0_0_15px_rgba(0,230,118,1)]"
               animate={{ y: ["-10%", "900%", "-10%"] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             />
             
             {/* Reticle / Corners graphic to look like AI Vision */}
             <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent/70" />
             <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent/70" />
             <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/70" />
             <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent/70" />
             
             {/* Tiny data points blinking */}
             <motion.div 
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
               className="absolute top-1/3 left-1/4 w-2 h-2 bg-text-primary rounded-full shadow-[0_0_8px_white]"
             />
             <motion.div 
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }}
               className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-text-primary rounded-full shadow-[0_0_8px_white]"
             />
             
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-[10px] font-mono text-accent px-2 py-1 rounded border border-accent/20 flex gap-2">
               <span>AI VISION SYSTEM</span>
               <span className="animate-pulse">● REC</span>
             </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none z-0" />
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
             <div className="bg-primary/80 backdrop-blur text-accent px-3 py-1 rounded-full text-xs font-semibold border border-accent/20">
               Photo Selected
             </div>
             <button 
                onClick={onClear}
                className="bg-danger/20 text-danger hover:bg-danger hover:text-white p-2 rounded-full backdrop-blur transition-colors"
                aria-label="Remove image"
             >
                <X size={20} />
             </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUploader;
