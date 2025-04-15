'use client';

import React from 'react';
import ProfilePicture from '@/components/atoms/profile-picture/profile-picture';
import ProfileDetail from '@/components/atoms/profile-detail/profile-detail';

interface ProfileCardProps {
  pictureSrc: string;
  pictureAlt: string;
  name: string;
  email: string;
  nic: string;
  phone: string;
  address: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  pictureSrc,
  pictureAlt,
  name,
  email,
  nic,
  phone,
  address,
}) => {
  return (
    <div
      className="flex items-center gap-6 p-6 bg-white rounded-lg shadow-md border border-neutral-200"
      style={{ width: '672px', height: '158px' }}
    >
      {/* Profile Picture */}
      <ProfilePicture src={pictureSrc} alt={pictureAlt} />

      {/* Profile Details */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-neutral-600">{name}</h3>
        <ProfileDetail label="Email" value={email} />
        <ProfileDetail label="NIC" value={nic} />
        <ProfileDetail label="Phone No." value={phone} />
        <ProfileDetail label="Address" value={address} />
      </div>
    </div>
  );
};

export default ProfileCard;