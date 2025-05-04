"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowUpIcon } from "lucide-react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string; remember: boolean }) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
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

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail, remember: true }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (isSubmitted && errors[name as keyof typeof errors] && name !== "remember") {
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
      onSubmit(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="space-y-12">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-600 mb-1">
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
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-600">
              Password
            </label>
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
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
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            }
            status={errors.password && isSubmitted ? "error" : "default"}
          />
          {errors.password && isSubmitted && (
            <p className="text-sm mt-1 text-red-600">{errors.password}</p>
          )}
        </div>
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-neutral-600">
            Remember Password
          </label>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <Button variant="primary" size="large" type="submit" disabled={isLoading}>
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