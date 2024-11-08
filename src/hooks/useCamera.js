import { useState, useRef } from 'react';

export default function useCamera() {
  const [stream, setStream] = useState(null);
  const [isFront, setIsFront] = useState(false); // Empezamos con cámara trasera para la INE
  const [isCapturingINE, setIsCapturingINE] = useState(true); // Estado para determinar si capturamos INE o selfie
  const videoRef = useRef();

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const facingMode = isFront ? "user" : "environment";
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
  };

  const stopCamera = () => {
    stream && stream.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const toggleCamera = () => {
    stopCamera();
    setIsFront(prev => !prev);
  };

  const captureINE = () => {
    setIsCapturingINE(true);
    if (isFront) toggleCamera(); // Cambiamos a cámara trasera si está en la frontal
  };

  const captureSelfie = () => {
    setIsCapturingINE(false);
    if (!isFront) toggleCamera(); // Cambiamos a cámara frontal si está en la trasera
  };

  return {
    videoRef,
    startCamera,
    stopCamera,
    takePhoto,
    toggleCamera,
    captureINE,
    captureSelfie,
    isFront,
    isCapturingINE,
  };
}