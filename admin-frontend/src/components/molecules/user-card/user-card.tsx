'use client';

import React from 'react';
import ProfilePicture from '@/components/atoms/profile-picture/profile-picture';
import Dropdown from '@/components/atoms/dropdown/dropdown';

interface UserProfileCardProps {
  pictureSrc: string;
  pictureAlt: string;
  name: string;
  role: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  pictureSrc,
  pictureAlt,
  name,
  role,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-neutral-200 rounded-lg shadow-md border border-neutral-300">
      {/* Profile Picture */}
      <ProfilePicture src={pictureSrc} alt={pictureAlt} />

      {/* Name and Role */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-neutral-600">{name}</h3>
        <p className="text-sm text-neutral-500">{role}</p>
      </div>

      {/* Dropdown Button (Chevron Down Only) */}
      <div className="ml-auto">
        <button className="p-2 bg-neutral-100 rounded-full">
          <Dropdown
            className="text-neutral-500"
            label="Options"
            options={['Option 1', 'Option 2', 'Option 3']}
            onSelect={(selectedOption) => console.log(selectedOption)}
          />
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;