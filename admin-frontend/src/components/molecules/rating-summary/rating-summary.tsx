import React from "react";
import StarRating from "@/components/atoms/star-rating/star-rating";
import colors from "@/styles/colors";
import "@/styles/fonts.css";

interface RatingSummaryProps {
  average: number;
  totalReviews: number;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ average, totalReviews }) => {
  return (
    <div
      className="text-center md:text-center"
      style={{ fontFamily: "var(--font-family-text)" }}
    >
      <p
        className="text-6xl font-bold"
        style={{
          color: colors.primary[100],
          fontWeight: "var(--font-weight-bold)",
          fontSize: "var(--font-size-3xl)",
        }}
      >
        {average.toFixed(1)}
      </p>

      <div className="flex justify-center md:justify-start mt-2">
        <StarRating initialRating={Math.round(average)} readOnly/>
      </div>

      <p
        className="mt-2"
        style={{
          color: colors.neutral[600],
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        {totalReviews.toLocaleString()} Reviews
      </p>
    </div>
  );
};

export default RatingSummary;