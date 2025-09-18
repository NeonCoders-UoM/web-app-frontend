"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/atoms/button/button"
import InputField from "@/components/atoms/input-fields/input-fields"
import Dropdown from "@/components/atoms/dropdown/dropdown"
import colors from "@/styles/colors"
import axiosInstance from "@/utils/axios"

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  userRole: string
}

interface RegistrationFormProps {
  isEditMode?: boolean
  user?: UserData
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  newPassword: string
  userRole: string
}

const roleMap: { [key: string]: number } = {
  "Super Admin": 1,
  "Admin": 2,
  "Service Center Admin": 3,
  "Cashier": 4,
  "Data Operator": 5,
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ user, isEditMode = false }) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    newPassword: "",
    userRole: user?.userRole || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleSelect = (option: string) => {
    setFormData((prev) => ({ ...prev, userRole: option }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userRoleId = roleMap[formData.userRole]
    if (!userRoleId) {
      alert("Please select a valid user role.")
      return
    }

    try {
      if (isEditMode && user?.id) {
        // ✅ UPDATE user (PUT)
        await axiosInstance.put(`/Admin/${user.id}`, {
  firstName: formData.firstName,
  lastName: formData.lastName,
  userRoleId: userRoleId,
  password: formData.newPassword || undefined
})

        alert("User updated successfully!")
      } else {
        // ✅ CREATE user (POST)
        await axiosInstance.post("/Admin/user-register", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userRoleId,
          password: formData.newPassword,
        })

        alert("User created successfully!")
      }

      router.push("/user-managment")
    } catch (error: any) {
      console.error("Error submitting form:", error)
      if (error.response?.data) {
        alert(`Request failed: ${error.response.data}`)
      } else {
        alert("An unexpected error occurred.")
      }
    }
  }

  const userRoleOptions = ["Super Admin", "Admin", "Service Center Admin", "Cashier", "Data Operator"]

  return (
    <div
      className="w-full max-w-[700px] p-8 bg-white rounded-lg shadow-md mx-auto"
      style={{ fontFamily: "var(--font-family-text)" }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-lg font-semibold mb-6 text-center" style={{ color: colors.primary[100] }}>
          {isEditMode ? "Edit User" : "Create New User"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: colors.neutral[200] }}>
              First Name
            </label>
            <InputField
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium" style={{ color: colors.neutral[200] }}>
              Last Name
            </label>
            <InputField
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium" style={{ color: colors.neutral[200] }}>
              Email
            </label>
            <InputField
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEditMode} // disable email editing if needed
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium" style={{ color: colors.neutral[200] }}>
              Password
            </label>
            <InputField
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Password"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isEditMode}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.neutral[200] }}>
            User Role
          </label>
          <Dropdown
            options={userRoleOptions}
            placeholder="Select the User Role"
            onSelect={handleRoleSelect}
            className="w-full"
            selectedOption={formData.userRole}
          />
        </div>

        <div className="pt-4 flex justify-center ">
          <Button type="submit" variant="primary" size="medium" className="px-8 py-2.5 font-medium">
            {isEditMode ? "SAVE CHANGES" : "CREATE USER"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm
