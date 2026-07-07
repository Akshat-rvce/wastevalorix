import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

let cachedModel = null;
let modelLoadingPromise = null;

/**
 * Preloads and warms up the TensorFlow.js COCO-SSD model.
 * Warmup compiles the WebGL shaders so the first real inference is instantaneous.
 */
export const preloadAndWarmupModel = async () => {
  if (cachedModel) return cachedModel;
  
  if (!modelLoadingPromise) {
    modelLoadingPromise = (async () => {
      try {
        console.log("TFJS: Starting background loading...");
        await tf.ready();
        
        // Force WebGL backend initialization early
        tf.getBackend(); 

        // Load the lite model (significantly faster load & inference)
        cachedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        console.log("TFJS: Model loaded. Starting warmup inference...");

        // Warmup: Run a dummy prediction on a 1x1 canvas to compile shaders.
        // This solves the 3-10s initial delay when starting the camera.
        const dummyCanvas = document.createElement('canvas');
        dummyCanvas.width = 224;
        dummyCanvas.height = 224;
        const ctx = dummyCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, 224, 224);
          await cachedModel.detect(dummyCanvas);
        }
        
        console.log("TFJS: Warmup complete. Model is fully optimized.");
        return cachedModel;
      } catch (err) {
        console.error("TFJS: Preload or warmup failed:", err);
        throw err;
      }
    })();
  }
  return modelLoadingPromise;
};
