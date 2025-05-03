'use client';

import React, { useRef } from 'react';
import { Camera } from 'lucide-react';

interface UploadPhotoProps {
  onChange: (file: File | null) => void;
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({ onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or JPG file.');
      event.target.value = '';
      onChange(null);
      return;
    }

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 3MB limit.');
      event.target.value = '';
      onChange(null);
      return;
    }

    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-lg font-medium text-neutral-600">
        Update the Photo
      </label>
      <div
        className="relative w-32 h-32 rounded-full bg-neutral-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-neutral-400 hover:bg-neutral-200 transition-colors"
        onClick={handleClick}
        role="button"
        aria-label="Upload photo"
      >
        <Camera size={32} className="text-neutral-500" />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
        />
      </div>
      <p className="text-sm text-neutral-500 text-center uppercase">
        Allowed JPEG, PNG, JPG formats, up to 3MB
      </p>
    </div>
  );
};

export default UploadPhoto;