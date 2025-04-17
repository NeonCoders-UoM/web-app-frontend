import React from "react";
import ProfilePicture from "@/components/atoms/profile-picture/profile-picture";

interface ClientCellProps {
  name: string;
  pictureSrc: string;
}

export const ClientCell: React.FC<ClientCellProps> = ({ name,pictureSrc }) => (
  <div className="flex items-center gap-3">
    <ProfilePicture src={pictureSrc} alt={name} />
    <span className="text-sm font-medium text-gray-900">{name}</span>
  </div>
);