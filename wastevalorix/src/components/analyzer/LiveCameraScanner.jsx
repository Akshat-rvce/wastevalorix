import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const LiveCameraScanner = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);

  useEffect(() => {
    let stream = null;
    let mounted = true;

    let animationId = null;

    const detectFrame = async (video, model, canvas) => {
      if (!mounted || !video || !canvas) return;
      if (video.readyState !== 4) {
        animationId = requestAnimationFrame(() => detectFrame(video, model, canvas));
        return;
      }
      
      try {
        const predictions = await model.detect(video);
        const ctx = canvas.getContext('2d');
        
        // Make canvas match video display exactly
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        predictions.forEach(prediction => {
          // Only show higher confidence
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
        
      } catch(err) {
        // tfjs error ignoring
      }

      if (mounted) {
        animationId = requestAnimationFrame(() => detectFrame(video, model, canvas));
      }
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraReady(true);
          
          // Load AI Model
          try {
            await tf.ready();
            const model = await cocoSsd.load();
            setModelLoading(false);
            detectFrame(videoRef.current, model, canvasRef.current);
          } catch(err) {
            console.error("TFJS Model Failed to Load", err);
          }
        }
      } catch (err) {
        if (mounted) setError('Camera permission denied. Please allow camera access.');
        console.error(err);
      }
    };
    startCamera();

    return () => {
      mounted = false;
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
      
      // Pause video to simulate freeze frame
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
      
      <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[300px] md:min-h-[400px]">
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
