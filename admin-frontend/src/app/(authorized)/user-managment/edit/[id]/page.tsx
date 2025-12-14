"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import RegistrationForm from "@/components/organism/registration-form/registration-form"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import axiosInstance from "@/utils/axios"
import { deleteAllAuthCookies } from "@/utils/cookies"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </div>
    )
  }

 if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header with back button, title, and user profile */}
      <div className="relative flex items-center justify-between mb-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/user-managment")}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md border border-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Users</span>
        </button>

        {/* User Profile Card */}
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            deleteAllAuthCookies();
            router.push("/login");
          }}
        />
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto">
        <RegistrationForm user={user} isEditMode={true} />
      </div>
    </div>
  )
}

export default EditUserPage