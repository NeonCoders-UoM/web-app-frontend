"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import LoginForm from "@/components/organism/login-form/login-form"

const LoginPage = () => {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const role = Array.isArray(params?.role) ? params.role[0] : params?.role || ""

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)

    try {
      console.log("Logging in as", role, "with", data)

      // Simulate login delay
      await new Promise((res) => setTimeout(res, 1000))

      // Redirect based on role
      switch (role) {
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
          alert("Invalid role")
      }
    } catch (err) {
      console.error("Login failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-50 px-4">
      <div className="w-[600px] h-[548px] bg-white p-8 rounded-[10px] shadow-md border">
      <h2 className="text-3xl font-extrabold text-center text-primary-900 mb-2"> Welcome to Vehicle Hub</h2>
         <p className="text-sm text-center text-neutral-400 mb-6">
          Please enter your email and password to continue as{" "}
          <span className="font-semibold capitalize">{role}</span>
        </p>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default LoginPage
