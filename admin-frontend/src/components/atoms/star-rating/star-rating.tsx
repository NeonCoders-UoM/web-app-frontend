"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  maxStars = 5,
  initialRating = 0,
  onChange,
  readOnly = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);

  const handleClick = (index: number) => {
    if (readOnly) return;
    setRating(index);
    if (onChange) onChange(index);
  };

  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starIndex = index + 1;
        const isActive = starIndex <= (hovered || rating);

        return (
          <Star
            key={starIndex}
            size={24}
            className={`transition-all ${
              isActive
                ? "fill-yellow-400 stroke-yellow-400"
                : "fill-neutral-300 stroke-neutral-400"
            } ${readOnly ? "" : "cursor-pointer"}`}
            onMouseEnter={() => !readOnly && setHovered(starIndex)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            onClick={() => handleClick(starIndex)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
