"use client"

import type React from "react"

import { useState } from "react"
import Button from "@/components/atoms/button/button"
import InputField from "@/components/atoms/input-fields/input-fields"
import Dropdown from "@/components/atoms/dropdown/dropdown"
import colors from "@/styles/colors"

export default function NewUserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userRole: "",
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
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  const userRoleOptions = ["Admin", "Super Admin", "Service Center Admin", "Cashier" ,"Data Operator"]

  return (
    <div
      className="w-[662px] h-[382px] p-6"
      style={{
        backgroundColor: "#FFFFFF",
        fontFamily: "var(--font-family-text)",
      }}
    >
      <h1
        className="mb-6"
        style={{
          color: colors.primary[200],
          fontSize: "var(--font-size-lg)",
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        New User
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="firstName"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
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
          <div>
            <label
              htmlFor="lastName"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
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

        <div className="mb-4">
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

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-1"
            style={{
              color: colors.neutral[600],
              fontSize: "var(--font-size-sm)",
              fontWeight: "var(--font-weight-regular)",
            }}
          >
            Password
          </label>
          <InputField
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <Dropdown
            label="User Role"
            options={userRoleOptions}
            placeholder="Select the User Role"
            onSelect={handleRoleSelect}
            className="w-full"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="medium">
            Create User
          </Button>
        </div>
      </form>
    </div>
  )
}
