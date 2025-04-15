'use client';

import React from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
  src: string;
  alt: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src, alt }) => {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={48} // 12 * 4 = 48px (matches w-12)
        height={48} // 12 * 4 = 48px (matches h-12)
        className="object-cover"
      />
    </div>
  );
};

export default ProfilePicture;