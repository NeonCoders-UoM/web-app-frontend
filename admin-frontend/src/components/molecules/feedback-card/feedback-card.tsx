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
    <div className="rounded-2xl p-4 max-w-3xl mx-auto bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ProfilePicture src={profileSrc} alt={profileAlt} />
          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: colors.primary[300] }}
            >
              {name}
            </h2>
            <p
              className="text-xsm font-medium"
              style={{ color: colors.states.ok }}
            >
              {clientId}
            </p>
            <p
              className="text-sm mt-1 font-medium"
              style={{ color: colors.primary[300] }}
            >
              Service Center - {serviceCenter}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <StarRating initialRating={rating} />
        </div>
      </div>
      <p
        className="text-md mt-12 leading-relaxed font-medium"
        style={{ color: colors.primary[300] }}
      >
        &quot;{feedback}&quot;
      </p>
    </div>
  );
};

export default FeedbackCard;
