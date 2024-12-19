import React from 'react';
import { Plus, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

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
  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(index, file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          onImageUpload(0, file);
        }
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg');
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center gap-4">
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
        <Button
          onClick={handleCameraCapture}
          variant="ghost"
          size="icon"
          className="bg-primary hover:bg-primary/90 text-white"
          aria-label="Take photo"
        >
          <Camera className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;