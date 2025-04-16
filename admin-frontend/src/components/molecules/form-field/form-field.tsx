"use client"

import type React from "react"
import type { ReactNode } from "react"

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, error, required = false, children }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-neutral-600">
        {label}
        {required && <span className="text-states-error ml-1">*</span>}
      </label>

      {children}

      {error && <p className="text-sm text-states-error mt-1">{error}</p>}
    </div>
  )
}

export default FormField
