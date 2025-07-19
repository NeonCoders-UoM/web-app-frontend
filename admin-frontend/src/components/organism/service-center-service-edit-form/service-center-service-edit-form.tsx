"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import colors from "@/styles/colors";
import { ServiceCenterServiceDTO } from "@/types";

interface ServiceCenterServiceEditFormProps {
  service?: ServiceCenterServiceDTO;
  onSubmit?: (data: { customPrice: number; loyaltyPoints: number }) => void;
  buttonLabel?: string;
  isLoading?: boolean;
}

export default function ServiceCenterServiceEditForm({
  service,
  onSubmit,
  buttonLabel = "Update",
  isLoading = false,
}: ServiceCenterServiceEditFormProps) {
  const [formData, setFormData] = useState({
    customPrice: 0,
    loyaltyPoints: 0,
  });

  const [errors, setErrors] = useState<{
    customPrice?: string;
    loyaltyPoints?: string;
  }>({});

  useEffect(() => {
    if (service) {
      setFormData({
        customPrice: service.customPrice || service.serviceBasePrice || 0,
        loyaltyPoints: service.serviceCenterLoyaltyPoints || 0,
      });
    }
  }, [service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;

    setFormData((prev) => ({ ...prev, [name]: numValue }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { customPrice?: string; loyaltyPoints?: string } = {};

    if (formData.customPrice <= 0) {
      newErrors.customPrice = "Custom price must be greater than 0";
    }

    if (formData.loyaltyPoints < 0) {
      newErrors.loyaltyPoints = "Loyalty points cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Form submitted:", formData);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  if (!service) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-neutral-600">Loading service details...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "var(--font-family-text)",
        padding: "20px",
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Service Information (Read-only) */}
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Service Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">
                Service Name
              </label>
              <p className="text-neutral-900">{service.serviceName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">
                Description
              </label>
              <p className="text-neutral-900">{service.serviceDescription}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">
                Base Price
              </label>
              <p className="text-neutral-900">{service.serviceBasePrice} LKR</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">
                Package
              </label>
              <p className="text-neutral-900">
                {service.packageName} ({service.packagePercentage}%)
              </p>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          {/* Custom Price */}
          <div>
            <label
              htmlFor="customPrice"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Custom Price (LKR) *
            </label>
            <InputField
              id="customPrice"
              name="customPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter custom price"
              value={formData.customPrice.toString()}
              onChange={handleChange}
            />
            {errors.customPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.customPrice}</p>
            )}
          </div>

          {/* Loyalty Points */}
          <div>
            <label
              htmlFor="loyaltyPoints"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Loyalty Points *
            </label>
            <InputField
              id="loyaltyPoints"
              name="loyaltyPoints"
              type="number"
              min="0"
              step="1"
              placeholder="Enter loyalty points"
              value={formData.loyaltyPoints.toString()}
              onChange={handleChange}
            />
            {errors.loyaltyPoints && (
              <p className="text-red-500 text-sm mt-1">
                {errors.loyaltyPoints}
              </p>
            )}
            <p className="text-neutral-500 text-xs mt-1">
              Calculated:{" "}
              {Math.round(
                (formData.customPrice * (service.packagePercentage || 0)) / 100
              )}{" "}
              points
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-8 space-x-4">
          <Button
            type="button"
            variant="secondary"
            size="medium"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : buttonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
