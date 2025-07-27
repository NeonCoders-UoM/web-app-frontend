"use client";

import React, { useState } from "react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const ForgotPasswordFormSimple: React.FC<ForgotPasswordFormProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a verification code.
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
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="large"
          onClick={onBack}
          className="flex-1"
        >
          Back to Login
        </Button>
        <Button
          variant="primary"
          size="large"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordFormSimple; 