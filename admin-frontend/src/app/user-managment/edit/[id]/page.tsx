"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import RegistrationForm from "@/components/organism/registration-form/registration-form"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import colors from "@/styles/colors"

interface User {
  id: string
  firstname: string
  lastname: string
  email: string
  userrole: string
  profilePicture?: string
}

const EditUserPage = () => {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const params = useParams()
  const userId = params.id as string

  // Log the userId for debugging
  useEffect(() => {
    console.log(`EditUserPage accessed with userId: ${userId}`)
  }, [userId])

  // Load user data from localStorage
  useEffect(() => {
    setIsClient(true)
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = storedUsers.find((u: User) => u.id === userId)
    setUser(foundUser || null)
    if (!foundUser) {
      console.log(`User with ID ${userId} not found in localStorage`)
    }
  }, [userId])

  // Server-side fallback
  if (!isClient) {
    return (
      <div className="relative min-h-screen bg-white">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div className="w-[151px] h-[44px] bg-neutral-100 animate-pulse rounded"></div>
        </div>
        <div className="flex flex-col items-start min-h-screen pt-16 pl-16">
          <h1 className="text-2xl font-bold mb-8 text-neutral-600">EDIT USER</h1>
          <div className="w-[620px] h-[380px] bg-neutral-50 rounded-lg animate-pulse border border-primary-100"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center min-h-screen pt-16">
        <p className="text-neutral-600">User not found</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* UserProfileCard at the top-right */}
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

      {/* "EDIT USER" heading and form */}
      <div className="flex flex-col items-start min-h-screen pt-16 pl-16">
        <h1
          className="text-2xl font-bold mb-8"
          style={{
            color: colors.primary[200],
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          EDIT USER
        </h1>

        {/* Centered form */}
        <div className="w-full flex justify-center">
          <div className="border border-primary-100 rounded-lg shadow-sm">
            <RegistrationForm user={user} isEditMode={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUserPage