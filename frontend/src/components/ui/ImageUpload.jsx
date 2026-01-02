import React, { useState, useRef } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { uploadAPI } from '../../services/api';
import { toast } from '../../hooks/use-toast';

const ImageUpload = ({ value, onChange, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value ? uploadAPI.getFullUrl(value) : '');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPG, PNG, GIF, WebP, or SVG image.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Show local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Upload to server
      const result = await uploadAPI.upload(file);
      
      if (result.success) {
        onChange(result.url);
        setPreview(uploadAPI.getFullUrl(result.url));
        toast({
          title: 'Image uploaded!',
          description: 'Your image has been uploaded successfully.',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
      setPreview(value ? uploadAPI.getFullUrl(value) : '');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-48 object-cover rounded-xl border border-[rgb(63,63,63)]"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="p-2 bg-[rgb(218,255,1)] text-[rgb(17,17,19)] rounded-lg hover:bg-[rgb(166,190,21)] transition-colors"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[rgb(218,255,1)] animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full h-48 border-2 border-dashed border-[rgb(63,63,63)] rounded-xl flex flex-col items-center justify-center gap-3 hover:border-[rgb(218,255,1)] hover:bg-[rgba(218,255,1,0.05)] transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-[rgb(218,255,1)] animate-spin" />
          ) : (
            <>
              <Image className="w-8 h-8 text-[rgb(161,161,170)]" />
              <span className="text-[rgb(161,161,170)] text-sm">Click to upload image</span>
              <span className="text-[rgb(161,161,170)] text-xs">JPG, PNG, GIF, WebP, SVG (max 5MB)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
