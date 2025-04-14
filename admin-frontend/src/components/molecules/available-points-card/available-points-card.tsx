"use client";

import React from "react";
import Image from "next/image";
import ProgressBar from "@/components/atoms/progress-bar/progress-bar";
import colors from "@/styles/colors";
import "@/styles/fonts.css";

interface Tier {
  name: string;
  threshold: number;
}

interface AvailablePointsCardProps {
  points: number;
  tiers: Tier[];
}

const tierImageMap: Record<string, string> = {
  Silver: "/images/silver.jpg",
  Gold: "/images/gold.jpg",
  Bronze: "/images/bronze.jpeg",
  Default: "/images/default.jpg",
};

const AvailablePointsCard: React.FC<AvailablePointsCardProps> = ({ points, tiers }) => {
  const sortedTiers = [...tiers].sort((a, b) => a.threshold - b.threshold);
  const achievedTier = [...sortedTiers].reverse().find((tier) => points >= tier.threshold);
  const nextTier = sortedTiers.find((tier) => points < tier.threshold);

  const nextThreshold = nextTier?.threshold ?? points;
  const progressPercent = nextTier ? (points / nextThreshold) * 100 : 100;
  const pointsToNext = nextTier ? nextThreshold - points : 0;

  const badgeKey = achievedTier?.name ?? "Default";
  const badgeImage = tierImageMap[badgeKey] ?? tierImageMap["Default"];

  return (
    <div
      className="flex items-center justify-between rounded-xl p-4 w-[22rem] border shadow-sm"
      style={{
        backgroundColor: colors.neutral[100],
        borderColor: colors.neutral[100],
        fontFamily: "var(--font-family-text)",
      }}
    >
      <div className="flex flex-col gap-2 w-2/3">
        <p className="text-sm font-medium" style={{ color: colors.neutral[400] }}>
          Available Points
        </p>
        <h2 className="text-2xl font-bold leading-tight" style={{ color: colors.neutral[600] }}>
          {points.toLocaleString()}
        </h2>
        <div className="mt-2">
          <ProgressBar value={progressPercent} />
        </div>
        <p className="text-sm font-normal" style={{ color: colors.neutral[200] }}>
          {nextTier
            ? `${pointsToNext} until ${nextTier.name}`
            : `Achieved ${achievedTier?.name}`}
        </p>
      </div>

      <div className="w-1/3 flex justify-end">
        <Image
          src={badgeImage}
          alt={`${achievedTier?.name ?? "Tier"} Badge`}
          width={72}
          height={72}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default AvailablePointsCard;
