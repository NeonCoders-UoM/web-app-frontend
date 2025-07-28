"use client";

import React, { useState } from "react";
import { ArrowUpIcon, ArrowLeft, Mail, Lock, Key } from "lucide-react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import axiosInstance from "@/utils/axios";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

type Step = "email" | "otp" | "reset";

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Sending forgot password request for email:", email);
      const response = await axiosInstance.post("Auth/forgot-password", { email });
      
      console.log("Forgot password response:", response.data);
      // Backend returns success message directly
      setSuccess(response.data || "OTP sent to your email address. Please check your inbox.");
      setStep("otp");
    } catch (err: any) {
      console.error("Send OTP error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    
    console.log("Verifying OTP for email:", email, "OTP:", otp);

    try {
      // For now, just move to reset step since backend might not have verify endpoint
      // In a real implementation, you would verify OTP first
      setStep("reset");
    } catch (err: any) {
      setError(err.response?.data || "Failed to verify OTP. Please check the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("Auth/resend-forgot-password-otp", email);
      
      // Backend returns success message directly
      setSuccess(response.data || "New OTP sent to your email address. Please check your inbox.");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setError(err.response?.data || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!email || !otp) {
      setError("Missing email or OTP. Please go back and try again.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    console.log("Attempting to reset password for:", { email, otp, newPassword: "***" });

    try {
      console.log("Sending reset password request:", { email, otp, newPassword: "***", confirmPassword: "***" });
      const response = await axiosInstance.post("Auth/reset-password", {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      
      console.log("Reset password response:", response.data);
      // Backend returns success message directly
      setSuccess(response.data || "Password reset successfully! You can now login with your new password.");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      console.error("Error response:", err.response?.data);
      
      // Handle validation errors properly
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Mail className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-600 mb-1">
          Email Address
        </label>
        <InputField
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          ariaLabel="Email Address"
          status={error && !email ? "error" : "default"}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="large"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={handleSendOtp}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <ArrowUpIcon className="w-4 h-4 animate-spin" />
              Sending...
            </span>
          ) : (
            "Send OTP"
          )}
        </Button>
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Key className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
        <p className="text-gray-600">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-neutral-600 mb-1">
          Verification Code
        </label>
        <InputField
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          ariaLabel="Verification Code"
          status={error && !otp ? "error" : "default"}
          maxLength={6}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm text-center">
          {success}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="large"
          onClick={() => setStep("email")}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={handleVerifyOtp}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <ArrowUpIcon className="w-4 h-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
        >
          Didn't receive the code? Resend
        </button>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Lock className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-600 mb-1">
          New Password
        </label>
        <InputField
          id="newPassword"
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          ariaLabel="New Password"
          status={error && !newPassword ? "error" : "default"}
          rightIcon={
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-neutral-400"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          }
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-600 mb-1">
          Confirm New Password
        </label>
        <InputField
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          ariaLabel="Confirm New Password"
          status={error && !confirmPassword ? "error" : "default"}
          rightIcon={
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer text-neutral-400"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          }
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm text-center">
          {success}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="large"
          onClick={() => setStep("otp")}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={handleResetPassword}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <ArrowUpIcon className="w-4 h-4 animate-spin" />
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md">
      {step === "email" && renderEmailStep()}
      {step === "otp" && renderOtpStep()}
      {step === "reset" && renderResetStep()}
    </div>
  );
};

export default ForgotPasswordForm; 