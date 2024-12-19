import React from 'react';
import { Plus, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImageUpload: (index: number, file: File) => void;
  maxImages?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImageUpload,
  className
}) => {
  const { toast } = useToast();

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(index, file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      // Wait for 1 second to let the camera initialize and adjust
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            onImageUpload(0, file);
          }
          // Always clean up the camera stream
          stream.getTracks().forEach(track => track.stop());
        }, 'image/jpeg', 0.95);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please make sure you've granted camera permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full max-w-2xl mx-auto", className)}>
      <div
        className="relative aspect-square w-full max-w-md rounded-2xl border-2 border-dashed border-white hover:border-primary transition-all duration-300 transform hover:scale-105 animate-fade-in"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(0, e)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {images[0] ? (
          <img
            src={images[0]}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Plus className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;