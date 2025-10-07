/**
 * Transformers.js Environment Configuration
 * This file configures Transformers.js for web-only usage
 */

// Only configure if we're in the browser
if (typeof window !== 'undefined') {
  // Configure environment before any imports
  (globalThis as any).ONNX_ENV = {
    wasm: {
      numThreads: 1,
      simd: true
    },
    webgl: false
  };
}