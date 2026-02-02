"use client"; 

import Image from "next/image";
import LoginForm from "@/components/organism/login-form/login-form";
import { setCookie, deleteCookie } from "@/utils/cookies";

const LoginPage = () => {
  const handleLoginSuccess = async (data: { email: string; password: string; remember: boolean }) => {
    try {
      // Optionally remember email
      if (data.remember) {
        setCookie("rememberedEmail", data.email, 30);
      } else {
        deleteCookie("rememberedEmail");
      }
    } catch (err) {
      console.error("Failed to handle login:", err);
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
          <div className="rounded-[10px] drop-shadow-2xl p-12" style={{ backgroundColor: '#010134' }}>
            <p className="text-white text-2xl font-bold text-center mb-2">
              Welcome to VApp Admin
            </p>
            <p className="text-sm text-center text-gray-300 mb-12">
              Please enter your email and password to continue
            </p>

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