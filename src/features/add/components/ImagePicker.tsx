'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import imageCompression from 'browser-image-compression';

interface ImagePickerProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
}

const compressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export function ImagePicker({ images, onChange, maxImages = 5 }: ImagePickerProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      // Only accept images
      if (!file.type.startsWith('image/')) return false;
      // Max 10MB per image (before compression)
      if (file.size > 10 * 1024 * 1024) return false;
      return true;
    });

    // Limit total images
    const remainingSlots = maxImages - images.length;
    const filesToProcess = validFiles.slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    setIsCompressing(true);

    try {
      // Compress all images in parallel
      const compressedFiles = await Promise.all(
        filesToProcess.map(async (file) => {
          try {
            const compressed = await imageCompression(file, compressionOptions);
            // Preserve original filename
            return new File([compressed], file.name, { type: compressed.type });
          } catch {
            // If compression fails, use original file
            return file;
          }
        })
      );

      onChange([...images, ...compressedFiles]);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((file, index) => (
            <div key={index} className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isCompressing && fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isCompressing
              ? 'border-divider bg-surface cursor-wait'
              : dragActive
                ? 'border-primary bg-primary/5 cursor-pointer'
                : 'border-divider hover:border-medium-grey cursor-pointer'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={isCompressing}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center">
              {isCompressing ? (
                <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-body text-dark-grey font-medium">
                {isCompressing ? t('add.images.compressing') : t('add.images.upload')}
              </p>
              <p className="text-small text-medium-grey">
                {isCompressing
                  ? t('add.images.compressingHint')
                  : t('add.images.hint', { remaining: maxImages - images.length })
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Max images reached message */}
      {!canAddMore && (
        <p className="text-small text-medium-grey text-center">
          {t('add.images.maxReached', { max: maxImages })}
        </p>
      )}
    </div>
  );
}
