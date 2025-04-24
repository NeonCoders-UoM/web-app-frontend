"use client"

import type React from "react"
import { useState } from "react"
import InputField from "@/components/atoms/input-fields/input-fields"
import UploadPhoto from "@/components/atoms/upload-photo/upload-photo"
import colors from "@/styles/colors"

interface CustomerUpdateFormProps {
  onSubmit?: (data: { customerName: string; email: string; nicNumber: string; telephoneNumber: string; address: string; photo: File | null }) => void
  initialData?: {
    customerName: string
    email: string
    nicNumber: string
    telephoneNumber: string
    address: string
    photo: File | null
  }
}

export default function CustomerUpdateForm({ onSubmit, initialData }: CustomerUpdateFormProps) {
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || "",
    email: initialData?.email || "",
    nicNumber: initialData?.nicNumber || "",
    telephoneNumber: initialData?.telephoneNumber || "",
    address: initialData?.address || "",
  })

  const [photo, setPhoto] = useState<File | null>(initialData?.photo || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({ ...formData, photo })
    } else {
      console.log("Form submitted:", { ...formData, photo })
    }
  }

  return (
    <div
      style={{
        width: "1077px",
        height: "432px",
        display: "flex",
        gap: "16px",
        fontFamily: "var(--font-family-text)",
      }}
    >
      {/* Left Section - Photo Upload */}
      <div
        style={{
          width: "320px",
          height: "320px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="text-center">
          <h3
            style={{
              fontSize: "var(--font-size-md)",
              fontWeight: "var(--font-weight-medium)",
              color: colors.neutral[600],
              marginBottom: "20px",
            }}
          >
            Upload a Photo
          </h3>

          <div className="flex justify-center">
            <UploadPhoto onChange={handlePhotoChange} />
          </div>
        </div>

        <p
          style={{
            color: "#cc0000",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            marginTop: "10px",
          }}
        >
          Not Required
        </p>
      </div>

      {/* Right Section - Form */}
      <div
        style={{
          width: "720px",
          height: "340px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Customer Name
              </label>
              <InputField
                id="customerName"
                name="customerName"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
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

            {/* NIC Number */}
            <div>
              <label
                htmlFor="nicNumber"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                NIC Number
              </label>
              <InputField
                id="nicNumber"
                name="nicNumber"
                placeholder="NIC Number"
                value={formData.nicNumber}
                onChange={handleChange}
              />
            </div>

            {/* Telephone Number */}
            <div>
              <label
                htmlFor="telephoneNumber"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Telephone Number
              </label>
              <InputField
                id="telephoneNumber"
                name="telephoneNumber"
                placeholder="Telephone Number"
                value={formData.telephoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label
                htmlFor="address"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Address
              </label>
              <InputField
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
                cursor: "pointer",
              }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}