'use client';

import React from "react";
import FeedbackTable from "@/components/organism/feedback-table/feedback-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import ReviewSummaryCard from "@/components/organism/review-summary-card/review-summary-card";
import "@/styles/fonts.css";

const FeedbackPage = () => {
  const feedbackData = [
    {
      clientName: "John Doe",
      profileSrc: "/images/profile1.jpg",
      profileAlt: "John's profile",
      clientId: "1",
      stars: 5,
      serviceCenter: "Speed Motors",
      date: "2025-04-01",
      feedback: "Excellent service! Highly recommended."
    },
    {
      clientName: "Jane Smith",
      profileSrc: "/images/profile2.jpg",
      profileAlt: "Jane's profile",
      clientId: "2",
      stars: 5,
      serviceCenter: "Rapid Repairs",
      date: "2025-04-02",
      feedback: "Amazing staff and thorough work!"
    },
    {
      clientName: "Mike Johnson",
      profileSrc: "/images/profile3.jpg",
      profileAlt: "Mike's profile",
      clientId: "3",
      stars: 3,
      serviceCenter: "AutoSure Solutions",
      date: "2025-04-03",
      feedback: "Average experience. Staff could be friendlier."
    },
    {
      clientName: "Emily Davis",
      profileSrc: "/images/profile4.jpg",
      profileAlt: "Emily's profile",
      clientId: "4",
      stars: 4,
      serviceCenter: "Speed Motors",
      date: "2025-04-04",
      feedback: ""
    },
    {
      clientName: "Daniel Wilson",
      profileSrc: "/images/profile5.jpg",
      profileAlt: "Daniel's profile",
      clientId: "5",
      stars: 4,
      serviceCenter: "Speed Motors",
      date: "2025-04-05",
      feedback: "Great service, but prices are slightly high."
    },
    {
      clientName: "Sophia Brown",
      profileSrc: "/images/profile6.jpg",
      profileAlt: "Sophia's profile",
      clientId: "6",
      stars: 5,
      serviceCenter: "MotorMedic Garage",
      date: "2025-04-06",
      feedback: "Excellent for hybrid cars! Fully satisfied."
    }
  ];

  const ratingStats = [
    { star: 5, count: 20000 },
    { star: 4, count: 8000 },
    { star: 3, count: 3000 },
    { star: 2, count: 1000 },
    { star: 1, count: 256 },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="h2 text-neutral-600">Customer Feedbacks</h1>

          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="Moni Roy"
            name="Moni Roy"
            role="admin"
            onLogout={() => console.log("Logout clicked")}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
          />
        </div>

        <div className="flex justify-center md:justify-start mb-10">
          <ReviewSummaryCard
            average={4.8}
            totalReviews={32256}
            ratings={ratingStats}
          />
        </div>

        {/* Feedback Table Component */}
        <FeedbackTable data={feedbackData} />
      </div>
    </div>
  );
};

export default FeedbackPage;