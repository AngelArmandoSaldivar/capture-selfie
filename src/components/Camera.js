import React, { useEffect } from 'react';
import useCamera from '../hooks/useCamera';
import CameraView from './CameraView';

function Camera() {
  const { 
    videoRef, 
    startCamera, 
    stopCamera, 
    takePhoto, 
    toggleCamera, 
    captureINE, 
    captureSelfie, 
    isFront, 
    isCapturingINE 
  } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [isFront]);

  const handleCaptureINE = () => {
    const photoDataUrl = takePhoto();
    console.log('Foto de INE capturada:', photoDataUrl);
    captureSelfie(); // Cambiamos a la cámara frontal para la selfie
  };

  const handleCaptureSelfie = () => {
    const photoDataUrl = takePhoto();
    console.log('Foto de selfie capturada:', photoDataUrl);
    captureINE(); // Cambia a la cámara trasera para empezar de nuevo
  };

  return (
    <CameraView 
      videoRef={videoRef} 
      onCapture={isCapturingINE ? handleCaptureINE : handleCaptureSelfie}
      onToggleCamera={toggleCamera} 
      isFront={isFront}
      isCapturingINE={isCapturingINE}
      onCaptureINE={handleCaptureINE}
      onCaptureSelfie={handleCaptureSelfie}
    />
  );
}

export default Camera;