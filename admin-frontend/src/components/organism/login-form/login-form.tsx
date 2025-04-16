"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import FormField from "@/components/molecules/form-field/form-field"
import InputField from "@/components/atoms/input-fields/input-fields"
import Button from "@/components/atoms/button/button"

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void
  isLoading?: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    } else {
      newErrors.email = ""
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    } else {
      newErrors.password = ""
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <FormField label="Password" htmlFor="password" error={errors.password} required>
        <InputField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          ariaLabel="Password"
          rightIcon={
            showPassword ? (
              <EyeOff size={20} onClick={togglePasswordVisibility} className="cursor-pointer" />
            ) : (
              <Eye size={20} onClick={togglePasswordVisibility} className="cursor-pointer" />
            )
          }
        />
      </FormField>

      <div className="flex justify-end -mt-3">
        <a href="#" className="text-sm text-primary-200 hover:text-primary-300 transition-colors">
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="medium"
        disabled={isLoading}
        icon={isLoading ? "loading" : undefined}
        className="w-full"
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <div className="text-center pt-2">
        <p className="text-sm text-neutral-400">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-primary-200 hover:text-primary-300 transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
