import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CameraInterface = ({ onImageCapture, isAnalyzing }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required. Please enable camera permissions in your browser settings.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream?.getTracks()?.forEach(track => track?.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const captureImage = useCallback(() => {
    if (!videoRef?.current || !canvasRef?.current) return;
    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    const context = canvas?.getContext('2d');
    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    context?.drawImage(video, 0, 0);
    canvas?.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      onImageCapture(blob, imageUrl);
      stopCamera();
    }, 'image/jpeg', 0.8);
  }, [onImageCapture, stopCamera]);

  const handleFileUpload = useCallback((event) => {
    const file = event?.target?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      onImageCapture(file, imageUrl);
    }
  }, [onImageCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    if (capturedImage) URL.revokeObjectURL(capturedImage);
  }, [capturedImage]);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border/60 bg-white/40">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
                <Icon name="ScanLine" size={24} className="text-primary pulse-subtle" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">New Scan</h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">Capture or upload a leaf image to diagnose issues.</p>
              </div>
            </div>
            {cameraActive && (
              <Button variant="outline" size="sm" onClick={stopCamera} className="mt-4 sm:mt-0">
                <Icon name="X" size={14} className="mr-2" />Stop Camera
              </Button>
            )}
          </div>
        </div>

        <div className="p-6">
          {!cameraActive && !capturedImage && (
            <div className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                className="relative cursor-pointer aspect-video bg-muted/30 hover:bg-primary/5 transition-all duration-300 rounded-2xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center p-8 group interactive-element"
                onClick={() => fileInputRef?.current?.click()}
              >
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Icon name="ImagePlus" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 text-center tracking-tight">Drag and drop or click to upload</h3>
                <p className="text-sm font-medium text-muted-foreground text-center">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => fileInputRef?.current?.click()} className="flex-1 h-14 gradient-primary text-white font-bold text-base shadow-hover interactive-element rounded-xl">
                  <Icon name="UploadCloud" size={20} className="mr-2" />
                  Upload & Scan
                </Button>
                <Button variant="outline" size="lg" onClick={startCamera} className="flex-1 h-14 border-border bg-white hover:bg-muted font-bold text-base text-foreground rounded-xl interactive-element">
                  <Icon name="Camera" size={20} className="mr-2 text-primary" />
                  Take Photo
                </Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
          )}

          {cameraActive && (
            <div className="space-y-6">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-primary/80 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl"></div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr"></div>
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br"></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black/70 backdrop-blur-md rounded-full px-4 py-2">
                    <p className="text-white text-sm font-medium">Position the leaf within the frame</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="xl" onClick={captureImage} disabled={isAnalyzing} className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-organic-lg hover:shadow-organic-md border-4 border-white grow-on-hover">
                  <Icon name="Camera" size={32} className="text-white" />
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-soft border border-border">
                <Image src={capturedImage} alt="Captured plant image" className="w-full h-full object-cover" />

                {isAnalyzing && (
                  <>
                    {/* Glowing green scanning overlay animation */}
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-1 bg-primary/60 shadow-[0_0_15px_rgba(64,192,116,0.8)] absolute animate-scan"></div>
                    </div>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 text-center shadow-xl max-w-xs w-full">
                        <div className="w-16 h-16 relative mx-auto mb-4">
                          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                          <Icon name="Scan" size={24} className="absolute inset-0 m-auto text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-1">Scanning Leaf...</h3>
                        <p className="text-sm border-0 font-medium text-muted-foreground">Identifying potential diseases</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" onClick={retakePhoto} disabled={isAnalyzing} className="flex-1 h-14 font-semibold hover:bg-slate-50">
                  <Icon name="RotateCcw" size={18} className="mr-2" />
                  Discard & Retake
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default CameraInterface;