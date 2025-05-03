"use client";

import React from "react";
import RatingSummary from "@/components/molecules/rating-summary/rating-summary";
import ReviewBarRow from "@/components/molecules/review-bar-row/review-bar-row";
import colors from "@/styles/colors";
import "@/styles/fonts.css";

interface RatingData {
  star: number;
  count: number;
}

interface ReviewSummaryCardProps {
  average: number;
  totalReviews: number;
  ratings: RatingData[];
}

const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({
  average,
  totalReviews,
  ratings,
}) => {
  const total = ratings.reduce((sum, r) => sum + r.count, 0);

  return (
    <div
      className="rounded-[20px] bg-white shadow-md py-[52px] px-[68px] border w-[607px] h-[382px]"
      style={{
        border: `1px solid ${colors.primary[200]}`,
        color: colors.neutral[600],
        fontFamily: "var(--font-family-text)",
      }}
    >
      <h2
        className="mb-[12px]"
        style={{
          fontFamily: "var(--font-family-display)",
          fontSize: "var(--font-size-2xl)",
          fontWeight: "var(--font-weight-semibold)",
          lineHeight: "var(--line-height-tight)",
          color: colors.neutral[600],
        }}
      >
        Summary
      </h2>

      <div className="flex flex-col md:flex-row gap-[28px]">
        <RatingSummary average={average} totalReviews={totalReviews} />
        <div className="flex-1 space-y-[12px]">
          {ratings.map(({ star, count }) => (
            <ReviewBarRow
              key={star}
              star={star}
              percent={(count / total) * 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummaryCard;