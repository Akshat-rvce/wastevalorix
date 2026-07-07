import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Module-level caching to prevent reloading the model on every component mount
let cachedModel = null;
let modelLoadingPromise = null;

const loadModelCached = async () => {
  if (cachedModel) return cachedModel;
  if (!modelLoadingPromise) {
    modelLoadingPromise = (async () => {
      await tf.ready();
      // Using 'lite_mobilenet_v2' for significantly faster load and execution
      cachedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      return cachedModel;
    })();
  }
  return modelLoadingPromise;
};

const LiveCameraScanner = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [model, setModel] = useState(null);

  const streamRef = useRef(null);
  const animationIdRef = useRef(null);

  // Load TFJS model once on mount
  useEffect(() => {
    let mounted = true;
    const initModel = async () => {
      try {
        const loadedModel = await loadModelCached();
        if (mounted) {
          setModel(loadedModel);
          setModelLoading(false);
        }
      } catch (err) {
        console.error("TFJS Model Failed to Load", err);
      }
    };
    initModel();
    return () => {
      mounted = false;
    };
  }, []);

  // Frame detection loop
  useEffect(() => {
    let mounted = true;
    
    if (!model || !isCameraReady) return;

    const detectFrame = async () => {
      if (!mounted || !videoRef.current || !canvasRef.current || !model) return;
      
      if (videoRef.current.readyState !== 4) {
        animationIdRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      try {
        const predictions = await model.detect(videoRef.current);
        if (!mounted || !canvasRef.current || !videoRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        
        // Make canvas match video display exactly
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        predictions.forEach(prediction => {
          if (prediction.score > 0.5) {
            const [x, y, width, height] = prediction.bbox;
            
            // Draw Target Box
            ctx.strokeStyle = '#00E676';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);

            // Draw Background for text
            ctx.fillStyle = '#00E676';
            ctx.fillRect(x, y - 30, width, 30);
            
            // Draw Text
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, x + 5, y - 8);
          }
        });
      } catch (err) {
        // tfjs error ignoring
      }

      if (mounted) {
        animationIdRef.current = requestAnimationFrame(detectFrame);
      }
    };

    detectFrame();

    return () => {
      mounted = false;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [model, isCameraReady]);

  // Handle camera start / restart
  useEffect(() => {
    let mounted = true;
    
    const stopActiveStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };

    const startCamera = async () => {
      setIsCameraReady(false);
      stopActiveStream();
      
      try {
        const constraints = {
          video: {
            width: { ideal: 854 },
            height: { ideal: 480 }
          }
        };

        if (selectedDeviceId) {
          constraints.video.deviceId = { exact: selectedDeviceId };
        } else {
          constraints.video.facingMode = 'user';
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraReady(true);
        }

        // Enumerate devices to get labels and allow switcher dropdown
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
        
        if (mounted) {
          setDevices(videoDevices);
          
          // Auto-selection check: if selectedDeviceId is NOT set yet,
          // check if active device is a mobile/virtual camera and swap it.
          if (!selectedDeviceId && videoDevices.length > 1) {
            const activeTrack = stream.getVideoTracks()[0];
            const activeLabel = (activeTrack?.label || '').toLowerCase();
            const activeId = activeTrack?.getSettings()?.deviceId || '';

            const mobileKeywords = ['droidcam', 'epoccam', 'iriun', 'obs', 'virtual', 'phone', 'mobile', 'camera proxy', 'elgato'];
            const isActiveMobile = mobileKeywords.some(kw => activeLabel.includes(kw));

            if (isActiveMobile) {
              const laptopKeywords = ['integrated', 'built-in', 'facetime', 'webcam', 'hd camera', 'front', 'chicony', 'realtek', 'usb video', 'usb camera'];
              let bestDevice = null;
              let bestScore = -100;

              for (const d of videoDevices) {
                const label = d.label.toLowerCase();
                let score = 0;
                if (laptopKeywords.some(kw => label.includes(kw))) score += 10;
                if (mobileKeywords.some(kw => label.includes(kw))) score -= 50;
                if (label.includes('camera') && !mobileKeywords.some(kw => label.includes(kw))) score += 2;

                if (score > bestScore) {
                  bestScore = score;
                  bestDevice = d;
                }
              }

              if (bestDevice && bestDevice.deviceId !== activeId) {
                setSelectedDeviceId(bestDevice.deviceId);
              } else {
                setSelectedDeviceId(activeId || videoDevices[0].deviceId);
              }
            } else {
              setSelectedDeviceId(activeId || videoDevices[0].deviceId);
            }
          }
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError('Camera permission denied. Please allow camera access.');
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      stopActiveStream();
    };
  }, [selectedDeviceId]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const base64Data = dataUrl.split(',')[1];
      onCapture(base64Data, 'image/jpeg');
      
      videoRef.current.pause();
    }
  };

  if (error) {
    return (
      <div className="w-full min-h-[300px] rounded-cards bg-card border border-danger/30 flex flex-col items-center justify-center p-6 text-center text-danger">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <p className="font-semibold">{error}</p>
        <p className="text-sm mt-2 opacity-70">Please check your permissions.</p>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-cards overflow-hidden bg-black border border-border group flex flex-col shadow-[0_0_30px_rgba(0,230,118,0.05)]">
      
      <div className="relative w-full overflow-hidden flex items-center justify-center aspect-[4/3] md:aspect-[16/10]">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {isCameraReady && (
          <>
            {/* Viewfinder Brackets */}
            <div className="absolute inset-8 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent"></div>
            </div>

            {/* Scan Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_15px_#00E676] animate-[scan_2s_linear_infinite]"
                 style={{ animationName: 'scanVertical', animationDuration: '3s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}>
            </div>
            
            <style>{`
              @keyframes scanVertical {
                0% { transform: translateY(0); }
                100% { transform: translateY(300px); }
              }
              @media (min-width: 768px) {
                @keyframes scanVertical {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(400px); }
                }
              }
            `}</style>

            {/* Camera Switcher Dropdown (Premium UI) */}
            {devices.length > 1 && (
              <div className="absolute top-4 left-4 z-30">
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold py-1.5 px-3 rounded-full border border-white/20 outline-none cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] appearance-none pr-8 relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '12px'
                  }}
                >
                  {devices.map((device, idx) => (
                    <option key={device.deviceId} value={device.deviceId} className="bg-[#0A192F] text-white">
                      {device.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Text below (styled as overlay for now) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-accent font-semibold bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-accent/30 text-sm whitespace-nowrap shadow-[0_0_15px_rgba(0,230,118,0.2)] z-30">
              {modelLoading ? 'Initializing Neural Engine...' : 'Point camera at waste — AI detecting...'}
            </div>

            {/* LIVE Label */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-[10px] font-mono text-accent px-3 py-1.5 rounded-full border border-accent/50 flex items-center gap-2 z-30 shadow-[0_0_10px_rgba(0,230,118,0.5)]">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span>LIVE</span>
            </div>
            
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none" />
          </>
        )}
      </div>

      <div className="p-4 bg-bg-primary border-t border-border z-30">
        <button 
          onClick={handleCapture}
          disabled={!isCameraReady}
          className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,230,118,0.2)]"
        >
          <Camera size={20} />
          Capture & Analyze
        </button>
      </div>
      
    </div>
  );
};

export default LiveCameraScanner;
