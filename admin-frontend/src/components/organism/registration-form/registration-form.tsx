"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/atoms/button/button"
import InputField from "@/components/atoms/input-fields/input-fields"
import Dropdown from "@/components/atoms/dropdown/dropdown"
import colors from "@/styles/colors"

interface User {
  id: string
  firstname: string
  lastname: string
  email: string
  userrole: string
  profilePicture?: string
}

interface RegistrationFormProps {
  user?: User
  isEditMode?: boolean
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  newPassword: string
  currentPassword: string
  userRole: string
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ user, isEditMode = false }) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
    newPassword: "",
    currentPassword: "",
    userRole: user?.userrole || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleSelect = (option: string) => {
    setFormData((prev) => ({ ...prev, userRole: option }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]")

    if (isEditMode && user) {
      // Update existing user
      const updatedUsers = existingUsers.map((u) =>
        u.id === user.id
          ? {
              ...u,
              firstname: formData.firstName,
              lastname: formData.lastName,
              email: formData.email,
              userrole: formData.userRole,
            }
          : u,
      )
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    } else {
      // Add new user
      const newIdNumber = existingUsers.length + 1
      const newId = `EMP-${String(newIdNumber).padStart(4, "0")}`
      const newUser: User = {
        id: newId,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        userrole: formData.userRole,
        profilePicture: "/images/userpic.jpg",
      }
      existingUsers.push(newUser)
      localStorage.setItem("users", JSON.stringify(existingUsers))
    }

    // Log navigation for debugging
    console.log(`Navigating to /user-managment after ${isEditMode ? "editing" : "adding"} user`)

    // Navigate back to the user management page
    router.push("/user-managment")
  }

  // Define user role options
  const userRoleOptions = ["Admin", "Super Admin", "Service Center Admin", "Cashier", "Data Operator"]

  return (
    <div
      className="w-full max-w-[700px] p-8 bg-white rounded-lg shadow-md mx-auto"
      style={{
        fontFamily: "var(--font-family-text)",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.neutral[600] }}>
          {isEditMode ? "Edit User" : "Create New User"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: colors.neutral[600] }}>
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
            <label htmlFor="lastName" className="block text-sm font-medium" style={{ color: colors.neutral[600] }}>
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
            <label htmlFor="email" className="block text-sm font-medium" style={{ color: colors.neutral[600] }}>
              Email
            </label>
            <InputField
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            {isEditMode ? (
              <>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium"
                  style={{ color: colors.neutral[600] }}
                >
                  Current Password
                </label>
                <InputField
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: colors.neutral[600] }}>
                  Password
                </label>
                <InputField
                  id="password"
                  name="newPassword"
                  type="password"
                  placeholder="Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </>
            )}
          </div>
        </div>

        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium" style={{ color: colors.neutral[600] }}>
                New Password
              </label>
              <InputField
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.neutral[600] }}>
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

        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="primary" size="medium" className="px-8 py-2.5 font-medium">
            {isEditMode ? "SAVE CHANGES" : "CREATE USER"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm
