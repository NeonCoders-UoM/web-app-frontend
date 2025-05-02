"use client"; // Make the page client-only

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/organism/login-form/login-form";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const determineUserRole = (email: string): string => {
    switch (true) {
      case email.includes("admin"):
        return "admin";
      case email.includes("super"):
        return "super-admin";
      case email.includes("service"):
        return "service-center-admin";
      case email.includes("cashier"):
        return "cashier";
      case email.includes("data"):
        return "data-operator";
      default:
        throw new Error("Invalid credentials");
    }
  };

  const redirectToDashboard = (userRole: string) => {
    switch (userRole) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "super-admin":
        router.push("/super-admin/dashboard");
        break;
      case "service-center-admin":
        router.push("/service-center/dashboard");
        break;
      case "cashier":
        router.push("/cashier/dashboard");
        break;
      case "data-operator":
        router.push("/data-operator/dashboard");
        break;
      default:
        throw new Error("Invalid role");
    }
  };

  const handleLogin = async (data: { email: string; password: string; remember: boolean }) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", data);
      await new Promise((res) => setTimeout(res, 1000));
      const userRole = determineUserRole(data.email);
      redirectToDashboard(userRole);
      if (data.remember) {
        localStorage.setItem("rememberedEmail", data.email);
      }
    } catch (err: unknown) {
      console.error("Login failed:", err);
      if (err instanceof Error) {
        setError(err.message || "Invalid credentials");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div
        className="rounded-[10px] shadow-md p-12"
        style={{ width: "600px", height: "548px", outline: '4px solid white' }}
      >
        <h2 className="text-2xl font-bold text-center text-neutral-600 mb-2">
          Welcome to Vehicle Hub
        </h2>
        <p className="text-sm text-center text-neutral-300 mb-6">
          Please enter your email and password to continue
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default LoginPage;