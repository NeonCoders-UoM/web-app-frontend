// src/app/components/organism/service-center-form/service-center-form.tsx
"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import Dropdown from "@/components/atoms/dropdown/dropdown";
import colors from "@/styles/colors";
import { ServiceCenter } from "@/types";

interface ServiceCenterFormProps {
  initialData?: Partial<ServiceCenter>;
  onSubmit: (data: Omit<ServiceCenter, "id">) => void;
}

export default function ServiceCenterForm({ initialData, onSubmit }: ServiceCenterFormProps) {
  const [formData, setFormData] = useState<Omit<ServiceCenter, "id">>({
    serviceCenterName: "",
    email: "",
    address: "",
    telephoneNumber: "",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionDate: "",
    availableServices: [], // Changed to string[]
    serviceHours: { start: "", end: "" }, // Changed to object
  });

  // Validation errors state
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<ServiceCenter, "id">, string>>>({});

  // Prefill form with initial data if provided (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        serviceCenterName: initialData.serviceCenterName || "",
        email: initialData.email || "",
        address: initialData.address || "",
        telephoneNumber: initialData.telephoneNumber || "",
        ownersName: initialData.ownersName || "",
        vatNumber: initialData.vatNumber || "",
        registrationNumber: initialData.registrationNumber || "",
        commissionDate: initialData.commissionDate || "",
        availableServices: initialData.availableServices || [], // Now an array
        serviceHours: initialData.serviceHours || { start: "", end: "" }, // Now an object
      });
    }
  }, [initialData]);

  // Handle input changes for text fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "serviceHoursStart") {
      setFormData((prev) => ({
        ...prev,
        serviceHours: { ...prev.serviceHours, start: value },
      }));
    } else if (name === "serviceHoursEnd") {
      setFormData((prev) => ({
        ...prev,
        serviceHours: { ...prev.serviceHours, end: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handle dropdown selection for availableServices
  const handleServiceSelect = (option: string) => {
    // Since Dropdown supports single selection, we store the selected option as a single-item array
    setFormData((prev) => ({ ...prev, availableServices: [option] }));
    setErrors((prev) => ({ ...prev, availableServices: undefined }));
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<ServiceCenter, "id">, string>> = {};

    // Required fields
    if (!formData.serviceCenterName.trim()) {
      newErrors.serviceCenterName = "Service Center Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.telephoneNumber.trim()) {
      newErrors.telephoneNumber = "Telephone Number is required";
    } else if (!/^\d{10}$/.test(formData.telephoneNumber)) {
      newErrors.telephoneNumber = "Telephone Number must be 10 digits";
    }
    if (!formData.ownersName.trim()) {
      newErrors.ownersName = "Owner\'s Name is required"; // Escaped single quote
    }
    if (!formData.vatNumber.trim()) {
      newErrors.vatNumber = "VAT Number is required";
    }
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration Number is required";
    }
    if (!formData.commissionDate.trim()) {
      newErrors.commissionDate = "Commission Date is required";
    } else if (isNaN(Date.parse(formData.commissionDate))) {
      newErrors.commissionDate = "Commission Date must be a valid date";
    }
    if (formData.availableServices.length === 0) {
      newErrors.availableServices = "At least one service must be selected";
    }
    if (!formData.serviceHours.start || !formData.serviceHours.end) {
      newErrors.serviceHours = "Service Hours are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const availableServiceOptions = [
    "Oil Change",
    "Tire Replacement",
    "Brake Service",
    "Engine Repair",
    "Full Inspection",
  ];

  return (
    <div
      style={{
        width: "743px",
        height: "570px",
        fontFamily: "var(--font-family-text)",
        padding: "20px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Service Center Name */}
          <div>
            <label
              htmlFor="serviceCenterName"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Service Center Name
            </label>
            <InputField
              id="serviceCenterName"
              name="serviceCenterName"
              placeholder="Service Center Name"
              value={formData.serviceCenterName}
              onChange={handleChange}
            />
            {errors.serviceCenterName && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceCenterName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Email
            </label>
            <InputField
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Address
            </label>
            <InputField
              id="address"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Telephone Number */}
          <div>
            <label
              htmlFor="telephoneNumber"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Telephone Number
            </label>
            <InputField
              id="telephoneNumber"
              name="telephoneNumber"
              placeholder="Telephone Number"
              value={formData.telephoneNumber}
              onChange={handleChange}
            />
            {errors.telephoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.telephoneNumber}</p>
            )}
          </div>

          {/* Owner's Name */}
          <div>
            <label
              htmlFor="ownersName"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Owner’s Name
            </label>
            <InputField
              id="ownersName"
              name="ownersName"
              placeholder="Owner's Name"
              value={formData.ownersName}
              onChange={handleChange}
            />
            {errors.ownersName && <p className="text-red-500 text-sm mt-1">{errors.ownersName}</p>}
          </div>

          {/* VAT Number */}
          <div>
            <label
              htmlFor="vatNumber"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              VAT Number
            </label>
            <InputField
              id="vatNumber"
              name="vatNumber"
              placeholder="VAT Number"
              value={formData.vatNumber}
              onChange={handleChange}
            />
            {errors.vatNumber && <p className="text-red-500 text-sm mt-1">{errors.vatNumber}</p>}
          </div>

          {/* Registration Number */}
          <div>
            <label
              htmlFor="registrationNumber"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Registration Number
            </label>
            <InputField
              id="registrationNumber"
              name="registrationNumber"
              placeholder="Registration Number"
              value={formData.registrationNumber}
              onChange={handleChange}
            />
            {errors.registrationNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>
            )}
          </div>

          {/* Commission Date */}
          <div>
            <label
              htmlFor="commissionDate"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Commission Date
            </label>
            <InputField
              id="commissionDate"
              name="commissionDate"
              type="date" // Changed to date input
              placeholder="Commission Date"
              value={formData.commissionDate}
              onChange={handleChange}
            />
            {errors.commissionDate && (
              <p className="text-red-500 text-sm mt-1">{errors.commissionDate}</p>
            )}
          </div>

          {/* Choose Available Services */}
          <div>
            <label
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Choose Available Services
            </label>
            <Dropdown
              options={availableServiceOptions}
              placeholder="Services"
              onSelect={handleServiceSelect}
              selectedOption={formData.availableServices[0] || ""} // Display the first selected service
              className="w-full"
            />
            {errors.availableServices && (
              <p className="text-red-500 text-sm mt-1">{errors.availableServices}</p>
            )}
          </div>

          {/* Service Hours */}
          <div>
            <label
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Service Hours
            </label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <InputField
                  id="serviceHoursStart"
                  name="serviceHoursStart"
                  type="time"
                  placeholder="Start Time"
                  value={formData.serviceHours.start}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <InputField
                  id="serviceHoursEnd"
                  name="serviceHoursEnd"
                  type="time"
                  placeholder="End Time"
                  value={formData.serviceHours.end}
                  onChange={handleChange}
                />
              </div>
            </div>
            {errors.serviceHours && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceHours}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button type="submit" variant="primary" size="medium">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}