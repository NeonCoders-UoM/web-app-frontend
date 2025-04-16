"use client"

import type React from "react"
import { useState } from "react"
import FormLayout from "@/components/molecules/form-layout/form-layout"
import FormField from "@/components/molecules/form-field/form-field"
import InputField from "@/components/atoms/input-fields/input-fields"
import Button from "@/components/atoms/button/button"
import UploadPhoto from "@/components/atoms/upload-photo/upload-photo"

interface ProfileFormProps {
  onSubmit: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company?: string
    position?: string
    photo?: File | null
  }) => void
  initialData?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    company?: string
    position?: string
  }
  isLoading?: boolean
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  onSubmit,
  initialData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
  },
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(initialData)

  const [photo, setPhoto] = useState<File | null>(null)

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file)
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
      valid = false
    } else {
      newErrors.firstName = ""
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
      valid = false
    } else {
      newErrors.lastName = ""
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    } else {
      newErrors.email = ""
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      valid = false
    } else {
      newErrors.phone = ""
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        photo,
      })
    }
  }

  return (
    <FormLayout
      title="Profile Information"
      subtitle="Update your personal information"
      onSubmit={handleSubmit}
      className="max-w-2xl"
    >
      <div className="flex flex-col items-center mb-6">
        <UploadPhoto onChange={handlePhotoChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="First Name" htmlFor="firstName" error={errors.firstName} required>
          <InputField
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            ariaLabel="First Name"
          />
        </FormField>

        <FormField label="Last Name" htmlFor="lastName" error={errors.lastName} required>
          <InputField
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            ariaLabel="Last Name"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Email Address" htmlFor="email" error={errors.email} required>
          <InputField
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            ariaLabel="Email Address"
          />
        </FormField>

        <FormField label="Phone Number" htmlFor="phone" error={errors.phone} required>
          <InputField
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            ariaLabel="Phone Number"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Company" htmlFor="company">
          <InputField
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your company name (optional)"
            ariaLabel="Company"
          />
        </FormField>

        <FormField label="Position" htmlFor="position">
          <InputField
            id="position"
            name="position"
            type="text"
            value={formData.position}
            onChange={handleChange}
            placeholder="Your job title (optional)"
            ariaLabel="Position"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="danger" size="medium" icon="close">
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={isLoading}
          icon={isLoading ? "loading" : "save"}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </FormLayout>
  )
}

export default ProfileForm
