'use client';

import React from 'react';

interface ProfilePictureProps {
  src: string;
  alt: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src, alt }) => {
  return (
    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ProfilePicture;