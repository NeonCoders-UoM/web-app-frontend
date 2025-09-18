"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/organism/login-form/login-form";
import colors from "@/styles/colors";
import axiosInstance from "@/utils/axios";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLoginSuccess = async (data: { email: string; password: string; remember: boolean }) => {
    try {
      // Optionally remember email
      if (data.remember) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
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
    
    <div className="flex items-center shadow-md justify-center min-h-screen bg-white">
      <div
        className="rounded-[10px] shadow-lg p-12"
      >
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: colors.primary[100] }}>
          Welcome to Vehicle Hub
        </h2>
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
  );
};

export default LoginPage;