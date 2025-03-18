"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  maxStars?: number;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ maxStars = 5, onChange }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const handleClick = (index: number) => {
    setRating(index);
    if (onChange) onChange(index);
  };

  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <Star
            key={starIndex}
            size={24}
            className={`cursor-pointer transition-all ${
              starIndex <= (hovered || rating) ? "fill-yellow-400 stroke-yellow-400" : "fill-neutral-300 stroke-neutral-400"
            }`}
            onMouseEnter={() => setHovered(starIndex)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleClick(starIndex)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;