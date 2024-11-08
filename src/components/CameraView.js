import React from 'react';

function CameraView({ 
  videoRef, 
  onCapture, 
  onToggleCamera, 
  isFront, 
  isCapturingINE, 
  onCaptureINE, 
  onCaptureSelfie 
}) {
  return (
    <div className="camera-view">
      <video ref={videoRef} autoPlay playsInline className="video-stream"></video>

      {/* Guía visual para INE */}
      {isCapturingINE && (
        <div className="ine-overlay">
          <p>Posicione la INE en el recuadro</p>
        </div>
      )}
      
      <div className="controls">
        {isCapturingINE ? (
          <button onClick={onCaptureINE}>Capturar INE</button>
        ) : (
          <button onClick={onCaptureSelfie}>Capturar Selfie</button>
        )}
        <button onClick={onToggleCamera}>
          Cambiar a {isFront ? "trasera" : "frontal"}
        </button>
      </div>
    </div>
  );
}

export default CameraView;