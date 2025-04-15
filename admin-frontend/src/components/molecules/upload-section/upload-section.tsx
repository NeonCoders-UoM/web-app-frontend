'use client';

import React from 'react';
import UploadPhoto from '@/components/atoms/upload-photo/upload-photo';
import UploadFile from '@/components/atoms/upload-file/upload-file';

interface UploadSectionProps {
  onPhotoChange: (file: File | null) => void;
  onFileChange: (file: File | null) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onPhotoChange, onFileChange }) => {
  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-md">
      {/* Upload Photo Section */}
      <UploadPhoto onChange={onPhotoChange} />

      {/* Upload File Section */}
      <UploadFile onChange={onFileChange} />
    </div>
  );
};

export default UploadSection;