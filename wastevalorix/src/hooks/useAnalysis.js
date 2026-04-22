import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeWasteWithGemini } from '../services/claudeService';
import { WASTE_TYPES } from '../constants/wasteData';
import { useHistory } from './useHistory';

const compressImage = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.onload = () => {
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX) { h = (h * MAX) / w; w = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          const r2 = new FileReader();
          r2.onload = (e2) => {
            const base64 = e2.target.result.split(',')[1];
            resolve({ base64, mediaType: 'image/jpeg' });
          };
          r2.readAsDataURL(blob);
        }, 'image/jpeg', 0.8);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const useAnalysis = () => {
  const navigate = useNavigate();
  const { saveAnalysis } = useHistory();
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const [selectedWaste, setSelectedWaste] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setImageFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    try {
      const { base64, mediaType } = await compressImage(file);
      setImageBase64(base64);
      setImageType(mediaType);
    } catch (err) {
      setError("Failed to read the image. Please try again with a clear photo.");
    }
    
    // Auto-clear manual selection if image uploaded
    setSelectedWaste(null);
  };

  const handleCameraCapture = (base64Str, mimeType) => {
    if (!base64Str) return;
    setImageBase64(base64Str);
    setImageType(mimeType);
    
    // Create preview URL directly from base64
    const url = `data:${mimeType};base64,${base64Str}`;
    setImageSrc(url);
    
    // Auto-clear manual selection
    setSelectedWaste(null);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let finalResults = null;
      if (imageBase64) {
        const analysisResult = await analyzeWasteWithGemini(imageBase64, imageType);
        
        // Validate we got real data back
        if (!analysisResult || !analysisResult.wasteType) {
          throw new Error('Invalid response from AI — no waste type returned');
        }
        
        finalResults = { ...analysisResult, quantity: quantity, source: 'ai' };
        
        // Save to history
        await saveAnalysis(finalResults);
        
        // Only navigate if we have valid data
        navigate('/results', {
          state: { result: finalResults }
        });
        
      } else if (selectedWaste) {
        // Manual Selection Flow
        const wasteData = WASTE_TYPES.find(w => w.id === selectedWaste);
        if (wasteData) {
          // Simulate slight delay for effect
          await new Promise(r => setTimeout(r, 1500));
          
          finalResults = {
            wasteType: wasteData.name,
            category: wasteData.category,
            method: wasteData.method,
            methodDetail: wasteData.methodDetail,
            kwhPerKg: wasteData.kwhPerKg,
            co2PerKg: wasteData.co2PerKg,
            confidence: 100, // Manual is 100%
            emoji: wasteData.icon,
            description: wasteData.description,
            efficiency: wasteData.efficiency,
            tips: wasteData.tips,
            didYouKnow: wasteData.didYouKnow,
            biogasM3PerKg: wasteData.biogasM3PerKg || 0,
            quantity,
            source: 'manual',
            color: wasteData.color
          };
          
          setResults(finalResults);
          navigate('/results', { state: { result: finalResults } });
        } else {
          throw new Error("Invalid waste selection.");
        }
      } else {
        throw new Error("Please upload an image or select a waste type manually.");
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setLoading(false);
      
      // Show error on the analyze page itself — do NOT navigate
      if (err.message?.includes('429') || err.message?.includes('TooManyRequests')) {
        setError('Rate limit hit — please wait 10 seconds and try again');
      } else if (err.message?.includes('404')) {
        setError('AI model not found — check API configuration');
      } else {
        setError('Analysis failed: ' + (err.message || 'Unknown error'));
      }
      return; // Stop here — do not navigate
    }
  };

  const resetAnalysis = () => {
    setImageFile(null);
    setImageBase64(null);
    setImageType(null);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setSelectedWaste(null);
    setQuantity(10);
    setLoading(false);
    setError(null);
    setResults(null);
  };

  return {
    imageFile, imageBase64, imageType, imageSrc,
    selectedWaste, setSelectedWaste,
    quantity, setQuantity,
    loading, error, setError, results,
    handleImageUpload,
    handleCameraCapture,
    handleAnalyze,
    resetAnalysis
  };
};
