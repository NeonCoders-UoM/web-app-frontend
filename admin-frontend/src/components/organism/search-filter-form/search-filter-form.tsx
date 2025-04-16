"use client"

import type React from "react"

import { useState } from "react"
import Button from "@/components/atoms/button/button"
import InputField from "@/components/atoms/input-fields/input-fields"

export default function AppointmentSearch() {
  const [appointmentId, setAppointmentId] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentId(e.target.value)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for appointment:", appointmentId)
    // Handle search logic here
  }

  return (
    <div
      style={{
        width: "967px",
        height: "158px",
        borderRadius: "10px",
        backgroundColor: "rgba(72, 128, 255, 0.2)", // #4880FF with 20% opacity
        padding: "24px",
        fontFamily: "var(--font-family-text)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSearch} className="flex flex-col">
        <label
          htmlFor="appointmentId"
          className="mb-2"
          style={{
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: "#555",
          }}
        >
          Appointment ID
        </label>

        <div className="flex gap-4 items-center">
          <div className="flex-grow">
            <InputField
              id="appointmentId"
              name="appointmentId"
              placeholder="Appointment ID"
              value={appointmentId}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" variant="primary" size="medium">
            Search
          </Button>
        </div>
      </form>
    </div>
  )
}
