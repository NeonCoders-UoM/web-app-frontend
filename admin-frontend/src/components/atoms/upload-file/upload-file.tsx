'use client';

import React, { useRef } from 'react';
import { CloudUpload } from 'lucide-react';

interface UploadFileProps {
  onChange: (file: File | null) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, JPG, or PDF file.');
      event.target.value = '';
      onChange(null);
      return;
    }

    // Validate file size (50MB = 50 * 1024 * 1024 bytes)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 50MB limit.');
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
    <div className="flex flex-col items-center gap-3">
      {/* Label */}
      <label className="text-sm font-medium text-neutral-600">
        Update Service Registration Copy
      </label>

      {/* Cloud Icon */}
      <div className="flex items-center justify-center">
        <CloudUpload size={48} className="text-neutral-400" />
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-500">
        Choose a file or drag & drop it here
      </p>

      {/* Allowed Formats Note */}
      <p className="text-xsm text-neutral-500 uppercase">
        JPEG, PNG, PDG, and PDF formats, up to 50MB
      </p>

      {/* Browse File Button */}
      <button
        onClick={handleClick}
        className="px-6 py-2 text-sm font-medium text-neutral-600 border border-neutral-400 rounded-full hover:bg-neutral-100 transition-colors"
      >
        Browse File
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg,application/pdf"
        className="hidden"
      />
    </div>
  );
};

export default UploadFile;