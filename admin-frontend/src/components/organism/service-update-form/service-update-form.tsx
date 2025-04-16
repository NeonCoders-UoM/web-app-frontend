"use client"

import type React from "react"

import { useState } from "react"
import Button from "@/components/atoms/button/button"
import InputField from "@/components/atoms/input-fields/input-fields"
import colors from "@/styles/colors"

export default function ServiceUpdateForm() {
  const [formData, setFormData] = useState({
    serviceName: "",
    amount: "",
    effectiveUntil: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  return (
    <div
      style={{
        width: "768px",
        height: "384px",
        fontFamily: "var(--font-family-text)",
        padding: "20px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          {/* Service Name */}
          <div>
            <label
              htmlFor="serviceName"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Service Name
            </label>
            <InputField
              id="serviceName"
              name="serviceName"
              placeholder="Service Name"
              value={formData.serviceName}
              onChange={handleChange}
            />
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Amount
            </label>
            <InputField
              id="amount"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          {/* Effective Until */}
          <div>
            <label
              htmlFor="effectiveUntil"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Effective Until
            </label>
            <InputField
              id="effectiveUntil"
              name="effectiveUntil"
              placeholder="Effective Until"
              value={formData.effectiveUntil}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button type="submit" variant="primary" size="medium">
            Update
          </Button>
        </div>
      </form>
    </div>
  )
}
