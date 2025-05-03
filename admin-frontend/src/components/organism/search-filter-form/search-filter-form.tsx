"use client"

import type React from "react"

import { useState } from "react"
import Button from "@/components/atoms/button/button"
import InputField from "@/components/atoms/input-fields/input-fields"

type AppointmentSearchProps = {
  appointmentId: string;
  setAppointmentId: (id: string) => void;
  onSearch: () => void;
};

export default function AppointmentSearch({ 
  appointmentId, 
  setAppointmentId, 
  onSearch, 
}: AppointmentSearchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(); // Call the parent's search function
  };

  return (
    <div
      style={{
        width: "967px",
        height: "158px",
        borderRadius: "20px",
        backgroundColor: "rgba(72, 128, 255, 0.2)", // #4880FF with 20% opacity
        padding: "40px",
        fontFamily: "var(--font-family-text)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label
          htmlFor="appointmentId"
          className="mb-[6px]"
          style={{
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            color: "#555",
          }}
        >
          Appointment ID
        </label>

        <div className="flex gap-[48px] items-center">
          <div className="w-[360px]">
            <InputField
              id="appointmentId"
              name="appointmentId"
              placeholder="Appointment ID"
              value={appointmentId}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <Button type="submit" variant="primary" size="medium">
              Search
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}