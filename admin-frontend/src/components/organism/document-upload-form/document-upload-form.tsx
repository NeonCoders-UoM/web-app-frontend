"use client"

import type React from "react"

import { useState } from "react"
import Button from "@/components/atoms/button/button"
import InputField from "@/components/atoms/input-fields/input-fields"
import Dropdown from "@/components/atoms/dropdown/dropdown"
import UploadPhoto from "@/components/atoms/upload-photo/upload-photo"
import UploadFile from "@/components/atoms/upload-file/upload-file"
import colors from "@/styles/colors"

export default function ServiceRegistrationForm() {
  const [formData, setFormData] = useState({
    serviceCenterName: "",
    email: "",
    address: "",
    telephoneNumber: "",
    ownersName: "",
    availableService: "",
    serviceHours: "",
    registrationNumber: "",
    vinNumber: "",
  })

  const [photo, setPhoto] = useState<File | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceSelect = (option: string) => {
    setFormData((prev) => ({ ...prev, availableService: option }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { ...formData, photo, file })
    // Handle form submission logic here
  }

  const availableServiceOptions = [
    "Oil Change",
    "Tire Replacement",
    "Brake Service",
    "Engine Repair",
    "Full Inspection",
  ]

  return (
    <div
      className="flex gap-5"
      style={{
        width: "1056px",
        height: "834px",
        fontFamily: "var(--font-family-text)",
      }}
    >
      {/* Left Column - Upload Section */}
      <div
        className="bg-white p-6 rounded-lg shadow-sm"
        style={{
          width: "308px",
          height: "738px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <UploadPhoto onChange={setPhoto} />
        <UploadFile onChange={setFile} />
      </div>

      {/* Right Column - Form Section */}
      <div
        className="bg-white p-6 rounded-lg shadow-sm"
        style={{
          width: "728px",
          height: "738px",
        }}
      >
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="serviceCenterName"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Service Center Name
              </label>
              <InputField
                id="serviceCenterName"
                name="serviceCenterName"
                placeholder="Service Center Name"
                value={formData.serviceCenterName}
                onChange={handleChange}
              />
            </div>
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
          </div>

          <div className="mb-4">
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

          <div className="grid grid-cols-2 gap-4 mb-4">
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
            <div>
              <label
                htmlFor="ownersName"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Owner&#39;s Name
              </label>
              <InputField
                id="ownersName"
                name="ownersName"
                placeholder="Owner's Name"
                value={formData.ownersName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Dropdown
                label="Choose Available Services"
                options={availableServiceOptions}
                placeholder="Choose Available Services"
                onSelect={handleServiceSelect}
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="serviceHours"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Service Hours
              </label>
              <InputField
                id="serviceHours"
                name="serviceHours"
                placeholder="Service Hours"
                value={formData.serviceHours}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="registrationNumber"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Registration Number
              </label>
              <InputField
                id="registrationNumber"
                name="registrationNumber"
                placeholder="Registration Number"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="vinNumber"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                VIN Number
              </label>
              <InputField
                id="vinNumber"
                name="vinNumber"
                placeholder="VIN Number"
                value={formData.vinNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-auto flex justify-end">
            <Button type="submit" variant="primary" size="medium">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
