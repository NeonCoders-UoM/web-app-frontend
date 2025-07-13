"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import RegistrationForm from "@/components/organism/registration-form/registration-form"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import axiosInstance from "@/utils/axios"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  userRole: string
}

const EditUserPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const userId = params?.id as string ?? ""

  useEffect(() => {
    setIsClient(true)
    
    const fetchUser = async () => {
      try {
  setLoading(true)
  const res = await axiosInstance.get(`/Admin/${userId}`)
  console.log("Response:", res.data)
  setUser({
    id: res.data.userId,
    firstName: res.data.firstName,
    lastName: res.data.lastName,
    email: res.data.email,
    userRole: res.data.role
  })
} catch (err) {
  console.error("API failed:", err)
} finally {
  setLoading(false)
}

    }

    if (userId) {
      fetchUser()
    }
  }, [userId])


  // Server-side fallback
  if (!isClient || loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div className="w-[151px] h-[44px] bg-neutral-100 animate-pulse rounded"></div>
        </div>
        <div className="flex flex-col items-start min-h-screen pt-16 pl-16">
          <h1 className="text-lg font-bold mb-8 text-neutral-600">EDIT USER</h1>
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
            onLogout={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
          />
      </div>

      {/* "EDIT USER" heading and form */}
      <div className="flex flex-col items-start min-h-screen pt-16 pl-16">

        {/* Centered form */}
        <div className="w-full flex justify-center px-4 py-8">
          <div className="border border-neutral-200 rounded-lg shadow-sm">
            <RegistrationForm user={user} isEditMode={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUserPage