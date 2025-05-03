'use client';

import React from 'react';
import ProfilePicture from '@/components/atoms/profile-picture/profile-picture';
import StarRating from '@/components/atoms/star-rating/star-rating';
import colors from '@/styles/colors';

interface FeedbackCardProps {
  profileSrc: string;
  profileAlt: string;
  name: string;
  clientId: string;
  serviceCenter: string;
  rating: number;
  feedback: string;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  profileSrc,
  profileAlt,
  name,
  clientId,
  serviceCenter,
  rating,
  feedback,
}) => {
  return (
    <div className="rounded-[20px] p-[100px] bg-white shadow-sm w-[585px] h-[374px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[8px]">
          <ProfilePicture src={profileSrc} alt={profileAlt}/>
          <div>
              <h2
                className="text-base font-medium"
                style={{ color: colors.primary[300] }}
              >
                {name}
              </h2>
              <p
                className="text-sm font-medium mb-[8px]"
                style={{ color: colors.states.ok }}
              >
                {clientId}
              </p>
            <p
              className="text-base font-medium"
              style={{ color: colors.primary[300] }}
            >
              Service Center - {serviceCenter}
            </p>
          </div>
        </div>
        <div className="mb-[14px]">
          <StarRating initialRating={rating} readOnly/>
        </div>
      </div>
      <p
        className="text-base mt-[18px] leading-relaxed font-normal"
        style={{ color: colors.primary[300] }}
      >
        &quot;{feedback}&quot;
      </p>
    </div>
  );
};

export default FeedbackCard;