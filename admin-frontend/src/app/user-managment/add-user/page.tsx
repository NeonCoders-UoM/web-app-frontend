"use client"

import { useState, useEffect } from "react"
import NewUserForm from "@/components/organism/registration-form/registration-form"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import colors from "@/styles/colors"

const AddUserPage = () => {
  const [isClient, setIsClient] = useState(false)

  // Only render the main content on the client side to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Server-side fallback
  if (!isClient) {
    return (
      <div className="relative min-h-screen bg-white">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div className="w-[151px] h-[44px] bg-neutral-100 animate-pulse rounded"></div>
        </div>
        <div className="flex flex-col items-center min-h-screen pt-16">
          <h1 className="text-2xl font-bold mb-8 text-neutral-600">New User</h1>
          <div className="w-[580px] h-[340px] bg-neutral-50 rounded-lg animate-pulse border border-primary-100"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* UserProfileCard at the top-right of the page */}
      <div className="absolute top-0 right-0 mt-4 mr-4">
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

      {/* Centered content with "New User" heading at the top */}
      <div className="flex flex-col items-center min-h-screen pt-16">
        <h1
          className="text-2xl font-bold mb-8"
          style={{
            color: colors.primary[200],
            fontSize: "var(--font-size-2xl)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          New User
        </h1>
        <div className="border border-primary-100 rounded-lg shadow-sm">
          <NewUserForm />
        </div>
      </div>
    </div>
  )
}

export default AddUserPage