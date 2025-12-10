"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import RegistrationForm from "@/components/organism/registration-form/registration-form"
import { useRouter } from "next/navigation";


const AddUserPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false)

  // Ensure rendering happens only on the client to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Server-side fallback (placeholder UI)
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center relative">
          {/* Back Button */}
          <button
            onClick={() => router.push("/user-managment")}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
              Back to Users
            </span>
          </button>

          {/* User Profile */}
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
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto">
        <RegistrationForm isEditMode={false} />
      </div>
    </div>
  )
}

export default AddUserPage