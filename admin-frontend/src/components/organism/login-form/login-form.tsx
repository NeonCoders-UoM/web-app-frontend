import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowUpIcon } from "lucide-react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import ForgotPasswordForm from "@/components/organism/forgot-password-form/forgot-password-form";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { getDashboardRoute } from "@/utils/auth";
import { setCookie, getCookie, deleteCookie } from "@/utils/cookies";

interface LoginFormProps {
  onSuccess?: (data: {
    email: string;
    password: string;
    remember: boolean;
  }) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess: _onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const rememberedEmail = getCookie("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        remember: true,
      }));
    }
  }, []);



  const handleLogin = async (data: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("Auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, userId, userRole, userRoleId, station_id, serviceCenterName } = response.data;

      // Store authentication data in cookies (7 days expiry)
      setCookie("token", token, 7);
      setCookie("userId", userId.toString(), 7);
      setCookie("userRole", userRole, 7);
      setCookie("userRoleId", userRoleId.toString(), 7);
      
      // Store station_id and service center name for service center admins
      if (station_id) {
        setCookie("station_id", station_id.toString(), 7);
        setCookie("serviceCenterName", serviceCenterName || "", 7);
      }

      // Dispatch custom event to notify components of role change
      window.dispatchEvent(new Event("roleChanged"));

      if (data.remember) {
        setCookie("rememberedEmail", data.email, 30); // 30 days for remembered email
      } else {
        deleteCookie("rememberedEmail");
      }

      console.log("Login response:", { userId, userRole, userRoleId, station_id, serviceCenterName });
      console.log("Using role ID for dashboard redirect:", userRoleId);
      
      // Create user object for redirection
      const user = {
        userId: userId.toString(),
        userRole,
        userRoleId: userRoleId.toString(),
        stationId: station_id?.toString(),
        serviceCenterName,
      };
      
      // Handle different user roles
      if (userRole === "SuperAdmin") {
        router.push("/super-admin");
      } else if (userRole === "Admin") {
        router.push("/admin-dashboard");
      } else if (userRole === "ServiceCenterAdmin" || userRole === "Cashier" || userRole === "DataOperator") {
        if (station_id) {
          router.push(`/service-center-dashboard/${station_id}`);
        } else {
          throw new Error("Service Center Admin, Cashier, and Data Operator must have a station_id");
        }
      } else {
        // For other roles, use the utility function
        const dashboardRoute = getDashboardRoute(user);
        router.push(dashboardRoute);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (
      isSubmitted &&
      errors[name as keyof typeof errors] &&
      name !== "remember"
    ) {
      validateForm();
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { email: "", password: "" };
    let valid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (validateForm()) {
      handleLogin(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        onBack={() => setShowForgotPassword(false)}
        onSuccess={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      <div className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white mb-1"
          >
            Email Address
          </label>
          <InputField
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            ariaLabel="Email Address"
            status={errors.email && isSubmitted ? "error" : "default"}
          />
          {errors.email && isSubmitted && (
            <p className="text-sm mt-1 text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-white hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <InputField
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            ariaLabel="Password"
            rightIcon={
              <span
                onClick={togglePasswordVisibility}
                className="cursor-pointer text-neutral-400"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
            }
            status={errors.password && isSubmitted ? "error" : "default"}
          />
          {errors.password && isSubmitted && (
            <p className="text-sm mt-1 text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-white">
            Remember Password
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center w-full">
        <Button
          variant="primary"
          size="large"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <ArrowUpIcon className="w-5 h-5 animate-spin" />
              Logging in...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
