'use client';

import React from 'react';
import Image from 'next/image';

interface ProfilePictureProps {
  alt: string;
  src?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ alt }) => {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
      <Image
        src="/images/profilepic.jpg" 
        alt={alt}
        width={48}
        height={48}
        className="object-cover"
      />
    </div>
  );
};

export default ProfilePicture;
