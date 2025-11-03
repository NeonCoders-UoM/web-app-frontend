import React from "react";
import ProgressBar from "@/components/atoms/progress-bar/progress-bar";
import colors from "@/styles/colors";
import "@/styles/fonts.css";

interface ReviewBarRowProps {
  star: number;
  percent: number;
}

const ReviewBarRow: React.FC<ReviewBarRowProps> = ({ star, percent }) => {
  return (
    <div
      className="flex items-center gap-2 text-sm"
      style={{ fontFamily: "var(--font-family-text)" }}
    >
      <span
        className="w-5 font-medium"
        style={{
          color: colors.primary[100],
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        {star}
      </span>
      <ProgressBar value={percent} height={20} />
    </div>
  );
};

export default ReviewBarRow;