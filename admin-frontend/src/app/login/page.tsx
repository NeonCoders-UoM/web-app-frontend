"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/organism/login-form/login-form"

const LoginPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to authenticate user
      await new Promise((res) => setTimeout(res, 1000))

      // This would be replaced with actual authentication logic
      // For demo purposes, we'll use email to determine role
      let userRole = ""

      if (data.email.includes("admin")) {
        userRole = "admin"
      } else if (data.email.includes("super")) {
        userRole = "super-admin"
      } else if (data.email.includes("service")) {
        userRole = "service-center-admin"
      } else if (data.email.includes("cashier")) {
        userRole = "cashier"
      } else if (data.email.includes("data")) {
        userRole = "data-operator"
      } else {
        throw new Error("Invalid credentials")
      }

      // Redirect based on role
      switch (userRole) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "super-admin":
          router.push("/super-admin/dashboard")
          break
        case "service-center-admin":
          router.push("/service-center/dashboard")
          break
        case "cashier":
          router.push("/cashier/dashboard")
          break
        case "data-operator":
          router.push("/data-operator/dashboard")
          break
        default:
          throw new Error("Invalid role")
      }
    } catch (err: unknown) {
      console.error("Login failed:", err)
      if (err instanceof Error) {
        setError(err.message || "Login failed. Please try again.")
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-50 px-4">
      <div className="w-full max-w-[450px] bg-white p-8 rounded-[10px] shadow-md border">
        <h2 className="text-2xl font-bold text-center text-neutral-600 mb-2">Welcome to Vehicle Hub</h2>
        <p className="text-sm text-center text-neutral-300 mb-6">Please enter your email and password to continue</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-states-error rounded-md text-sm">{error}</div>}

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default LoginPage
