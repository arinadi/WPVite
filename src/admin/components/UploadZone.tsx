import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useUploadMedia } from '@/admin/hooks/useMedia';
import { toast } from 'react-hot-toast';

interface UploadZoneProps {
  onUploadSuccess?: () => void;
}

export function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error('Please upload image files only');
      return;
    }

    validFiles.forEach(file => {
      // Limit file size (e.g. 4.5MB)
      if (file.size > 4.5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 4.5MB)`);
        return;
      }

      uploadMutation.mutate(file, {
        onSuccess: () => {
          toast.success(`Uploaded ${file.name}`);
          onUploadSuccess?.();
        },
        onError: () => {
          toast.error(`Failed to upload ${file.name}`);
        }
      });
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
        ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}
      `}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
      />
      
      {uploadMutation.isPending ? (
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4" />
      ) : (
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8" />
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900">
        {uploadMutation.isPending ? 'Uploading...' : 'Click or drag images here'}
      </h3>
      <p className="text-gray-500 mt-2 text-sm">
        Supports JPG, PNG, GIF, WebP (max 4.5MB)
      </p>
    </div>
  );
}
