"use client";

import React from "react";
import Image from "next/image";
import ProgressBar from "@/components/atoms/progress-bar/progress-bar";
import colors from "@/styles/colors";


interface Tier {
  name: string;
  threshold: number;
}

interface AvailablePointsCardProps {
  points: number;
  tiers: Tier[];
}

const tierImageMap: Record<string, string> = {
  Silver: "/images/silver.avif",
  Gold: "/images/gold.avif",
  Bronze: "/images/bronze.jpeg",
  Default: "/images/default.avif",
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
      className="flex items-center justify-between bg-white rounded-[20px] py-[18px] px-[16px] w-[362px] h-[170px] border shadow-md"
      style={{
        borderColor: colors.neutral[100],
        fontFamily: "var(--font-family-text)",
      }}
    >
      <div className="flex flex-col w-[196px]">
        <p className="text-sm font-medium mb-[10px]" style={{ color: colors.neutral[600] }}>
          Available Points
        </p>
        <h2 className="text-2xl font-semibold leading-tight mb-[38px]" style={{ color: colors.neutral[600] }}>
          {points.toLocaleString()}
        </h2>
        <div className="mt-2">
          <ProgressBar value={progressPercent} />
        </div> 
      </div>

      <div className="flex flex-col">
        <Image
          src={badgeImage}
          alt={`${achievedTier?.name ?? "Tier"} Badge`}
          width={96}
          height={96}
          className="object-contain"
        />
        <p className="text-sm font-normal mt-[10px]" style={{ color: colors.neutral[200] }}>
          {nextTier
            ? `${pointsToNext} until ${nextTier.name}`
            : `Achieved ${achievedTier?.name}`}
        </p>
      </div>
    </div>
  );
};

export default AvailablePointsCard;