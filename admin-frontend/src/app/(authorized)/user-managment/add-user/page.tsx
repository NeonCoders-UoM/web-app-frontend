"use client"

import { useState, useEffect } from "react"
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
      <div className="relative min-h-screen bg-white">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div className="w-[151px] h-[44px] bg-neutral-100 animate-pulse rounded"></div>
        </div>
        <div className="flex flex-col items-start min-h-screen pt-16 pl-16">
          <h1 className="text-2xl font-bold mb-8 text-neutral-600">NEW USER</h1>
          <div className="w-[620px] h-[380px] bg-neutral-50 rounded-lg animate-pulse border border-primary-100"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* UserProfileCard at the top-right */}
      <div className="absolute top-0 right-0 mt-4 mr-4">
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

      {/* "NEW USER" heading and form */}
      <div className="flex flex-col items-start min-h-screen pt-16 pl-16">
        {/* Centered form */}
        <div className="w-full flex justify-center px-4 py-10">
          <div className="border border-neutral-200 rounded-lg shadow-sm">
            <RegistrationForm isEditMode={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUserPage