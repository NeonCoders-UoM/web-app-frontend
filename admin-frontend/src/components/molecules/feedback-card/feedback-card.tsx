'use client';

import React from 'react';
import ProfilePicture from '@/components/atoms/profile-picture/profile-picture';
import StarRating from '@/components/atoms/star-rating/star-rating';
import { MapPin, Quote } from 'lucide-react';

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
    <div className="group relative rounded-md p-6 bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 w-full max-w-lg h-auto">
      {/* Decorative Quote Icon */}
      <div className="absolute top-4 right-4 text-blue-100 group-hover:text-blue-200 transition-colors">
        <Quote className="w-10 h-10" fill="currentColor" />
      </div>

      {/* Header Section */}
      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className="flex-shrink-0">
          <ProfilePicture src={profileSrc} alt={profileAlt} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-800 truncate mb-1">
            {name}
          </h2>
          
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
            
            <p className="truncate font-medium">{serviceCenter}</p>
          </div>

          <div className="flex items-center gap-2">
            <StarRating initialRating={rating} readOnly />
            <span className="text-sm font-semibold text-gray-700">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Text */}
      <div className="relative">
        <p className="text-gray-700 leading-relaxed text-sm italic line-clamp-4">
          &quot;{feedback}&quot;
        </p>
      </div>

      {/* Client ID Badge */}
      <div className="mt-4 pt-4 border-t border-blue-600">
        
      </div>
    </div>
  );
};

export default FeedbackCard;