import { useEffect, useState, useRef, useCallback } from 'react';
import * as faceDetection from '@tensorflow-models/face-detection';
import '@tensorflow/tfjs';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import './App.css';
import { drawFaceBox, startWebcam, clearCanvas } from './utisl';

function App() {
  const [detector, setDetector] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const predict = useCallback(async () => {
    // Check isRunning first
    if (!isRunning || !detector || !videoRef.current || !canvasRef.current) {
      return;
    }

    // Make sure video has valid dimensions before proceeding
    if (
      !videoRef.current.srcObject ||
      videoRef.current.videoWidth === 0 ||
      videoRef.current.videoHeight === 0
    ) {
      console.log('Video dimensions not ready yet');
      return;
    }

    try {
      const predictions = await detector.estimateFaces(videoRef.current);
      drawFaceBox(videoRef.current, canvasRef.current, predictions);
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  }, [detector, videoRef, canvasRef, isRunning]); // Add isRunning to dependencies

  // Initialize detector
  useEffect(() => {
    const createDetector = async () => {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detector = await faceDetection.createDetector(model, { runtime: 'tfjs' });
      setDetector(detector);
    };
    createDetector();
  }, []);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        setIsRunning(false);
      }
    };
  }, []);

  // Setup continuous prediction when isRunning changes
  useEffect(() => {
    let isMounted = true;

    if (isRunning) {
      const runPrediction = async () => {
        if (!isMounted || !isRunning) return;

        await predict();

        // Only request next frame if still running and component is mounted
        if (isMounted && isRunning) {
          rafRef.current = requestAnimationFrame(runPrediction);
        }
      };
      runPrediction();
    }

    return () => {
      isMounted = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isRunning, predict]);

  const handleStartWebcam = async () => {
    console.log('Starting webcam...');
    if (videoRef.current) {
      try {
        await startWebcam(videoRef.current);

        // Make sure video is fully loaded before starting detection
        await new Promise(resolve => {
          // Wait for video to have valid dimensions and be playing
          const checkVideoReady = () => {
            if (
              videoRef.current.readyState === 4 &&
              videoRef.current.videoWidth > 0 &&
              videoRef.current.videoHeight > 0
            ) {
              resolve();
            } else {
              setTimeout(checkVideoReady, 100);
            }
          };
          checkVideoReady();
        });

        console.log(
          'Video ready with dimensions:',
          videoRef.current.videoWidth,
          'x',
          videoRef.current.videoHeight
        );

        setIsRunning(true); // Start continuous prediction
      } catch (error) {
        console.error('Failed to start webcam:', error);
      }
    }
  };

  const handleStopWebcam = () => {
    // First, stop the animation loop by setting isRunning to false
    setIsRunning(false);

    // Immediately cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Add a small delay to ensure React state has updated
    setTimeout(() => {
      // Then stop the video tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      // Clear the canvas
      if (canvasRef.current) {
        clearCanvas(canvasRef.current);
      }
    }, 50);
  };

  return (
    <>
      <section id="webcam-section">
        <section id="input">
          <h2>Face Detection with Webcam</h2>

          <div className="video-container">
            <video ref={videoRef} width="640" height="480"></video>
            <canvas ref={canvasRef} id="canvas" width="640" height="480"></canvas>
          </div>
        </section>
        <div className="controls">
          {!isRunning ? (
            <button onClick={handleStartWebcam}>Start Camera</button>
          ) : (
            <button onClick={handleStopWebcam}>Stop Camera</button>
          )}
        </div>
      </section>
    </>
  );
}

export default App;
