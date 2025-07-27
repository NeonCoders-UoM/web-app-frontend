'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FeedbackTable from "@/components/organism/feedback-table/feedback-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import ReviewSummaryCard from "@/components/organism/review-summary-card/review-summary-card";
import { FeedbackDTO, FeedbackStatsDTO } from "@/types";
import { getAllFeedbacks, getFeedbackStats } from "@/utils/api";
import { formatDate } from "@/lib/utils";
import "@/styles/fonts.css";

const FeedbackPage = () => {
  const router = useRouter();
  const [feedbackData, setFeedbackData] = useState<FeedbackDTO[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch feedbacks and stats in parallel
      const [feedbacks, stats] = await Promise.all([
        getAllFeedbacks({ page: 1, pageSize: 50 }), // Adjust pageSize as needed
        getFeedbackStats()
      ]);

      setFeedbackData(feedbacks);
      setFeedbackStats(stats);
    } catch (err) {
      console.error("Error fetching feedback data:", err);
      setError("Failed to load feedback data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  // Transform backend data to match the frontend component format
  const transformedFeedbackData = feedbackData.map((feedback) => ({
    clientName: feedback.customerName,
    profileSrc: "/images/profilepic.jpg", // Default profile image
    profileAlt: `${feedback.customerName}'s profile`,
    clientId: feedback.customerId.toString(),
    stars: feedback.rating,
    serviceCenter: feedback.serviceCenterName,
    date: formatDate(feedback.feedbackDate), // Use the utility function
    feedback: feedback.comments || ""
  }));

  // Transform stats data for the ReviewSummaryCard
  const ratingStats = feedbackStats ? [
    { star: 5, count: feedbackStats.ratingCounts[5] || 0 },
    { star: 4, count: feedbackStats.ratingCounts[4] || 0 },
    { star: 3, count: feedbackStats.ratingCounts[3] || 0 },
    { star: 2, count: feedbackStats.ratingCounts[2] || 0 },
    { star: 1, count: feedbackStats.ratingCounts[1] || 0 },
  ] : [];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-[58px]">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-neutral-600">Loading feedback data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-[58px]">
          <div className="flex justify-center items-center h-64 flex-col gap-4">
            <div className="text-lg text-red-600">{error}</div>
            <button
              onClick={fetchFeedbackData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-full mx-auto w-full">
        {/* Header with user profile */}
        <div className="flex justify-end items-center mb-10">
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          />
        </div>
        
        <div className="flex justify-between items-center mb-[28px]">
          <h1 className="h2 text-neutral-600">Customer Feedbacks</h1>
          <button
            onClick={fetchFeedbackData}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="flex justify-center md:justify-start mb-[46px]">
          <ReviewSummaryCard
            average={feedbackStats?.averageRating || 0}
            totalReviews={feedbackStats?.totalFeedbacks || 0}
            ratings={ratingStats}
          />
        </div>

        {/* Feedback Table Component */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/80 overflow-x-auto">
          <FeedbackTable data={transformedFeedbackData} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;