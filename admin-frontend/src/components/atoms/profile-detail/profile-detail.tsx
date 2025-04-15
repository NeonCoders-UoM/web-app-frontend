'use client';

import React from 'react';

interface ProfileDetailProps {
  label: string;
  value: string;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ label, value }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium text-neutral-600">{label}:</span>
      <span className="text-neutral-600">{value}</span>
    </div>
  );
};

export default ProfileDetail;