"use client"

import type React from "react"
import type { FormEvent, ReactNode } from "react"

interface FormLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  className?: string
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, title, subtitle, onSubmit, className = "" }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <div className={`w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-neutral-600 mb-2">{title}</h2>
        {subtitle && <p className="text-sm text-neutral-300">{subtitle}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  )
}

export default FormLayout
