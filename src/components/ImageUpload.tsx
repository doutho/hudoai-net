import { Plus, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImageUpload: (index: number, file: File) => void;
  className?: string;
}

const ImageUpload = ({
  images,
  onImageUpload,
  className
}: ImageUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(index, file);
    }
  };

  const handleCameraCapture = async () => {
    let stream: MediaStream | null = null;
    
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve(true);
        };
      });

      await video.play();

      // Wait for 1 second to let the camera initialize and adjust
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        try {
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => {
              if (b) resolve(b);
              else reject(new Error('Failed to create blob'));
            }, 'image/jpeg', 0.95);
          });
          
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          onImageUpload(0, file);
        } catch (error) {
          console.error('Error creating image file:', error);
          toast({
            title: "Error",
            description: "Failed to process the captured image.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please make sure you've granted camera permissions.",
        variant: "destructive"
      });
    } finally {
      // Always clean up the camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  return (
    <div className={cn('grid gap-4', className)}>
      <div className="grid grid-cols-1 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {image ? (
              <img
                src={image}
                alt={`Uploaded ${index + 1}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <label
                htmlFor={`image-${index}`}
                className="flex flex-col items-center justify-center w-full h-full bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Plus className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Upload Image
                </span>
                <input
                  id={`image-${index}`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFileChange(index, e)}
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;