"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginForm from "@/components/organism/login-form/login-form";
import colors from "@/styles/colors";
import axiosInstance from "@/utils/axios";
import { setCookie, deleteCookie } from "@/utils/cookies";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLoginSuccess = async (data: { email: string; password: string; remember: boolean }) => {
    try {
      // Optionally remember email
      if (data.remember) {
        setCookie("rememberedEmail", data.email, 30);
      } else {
        deleteCookie("rememberedEmail");
      }

      // Make API call to get user role (if needed)
      // const response = await axiosInstance.get('/user/role');
      // redirectToDashboard(response.data.role);
    } catch (err) {
      console.error("Failed to get user role:", err);
      setError("Failed to determine user role");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Car Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/vehicle.jpg"
          alt="Vehicle"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md">
          <div className="rounded-[10px] shadow-lg p-12">
            <p className="text-blue-500 text-2xl font-bold text-center mb-2">
              Welcome to VApp Admin
            </p>
            <p className="text-sm text-center text-neutral-500 mb-12">
              Please enter your email and password to continue
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
                {error}
              </div>
            )}

            <LoginForm 
              onSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;