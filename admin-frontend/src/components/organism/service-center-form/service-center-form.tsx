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
  const [formData, setFormData] = useState({
    serviceCenterName: "",
    email: "",
    address: "",
    telephoneNumber: "",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionDate: "",
    availableServices: "",
    serviceHours: "",
  });

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
        availableServices: initialData.availableServices || "",
        serviceHours: initialData.serviceHours || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (option: string) => {
    setFormData((prev) => ({ ...prev, availableServices: option }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        height: "570px", // Fixed: Added colon (:)
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
              Owner&rsquo;s Name
            </label>
            <InputField
              id="ownersName"
              name="ownersName"
              placeholder="Owner's Name"
              value={formData.ownersName}
              onChange={handleChange}
            />
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
              placeholder="Commission Date"
              value={formData.commissionDate}
              onChange={handleChange}
            />
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
              selectedOption={formData.availableServices}
              className="w-full"
            />
          </div>

          {/* Service Hours */}
          <div>
            <label
              htmlFor="serviceHours"
              className="block mb-1"
              style={{
                color: colors.neutral[600],
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              Service Hours
            </label>
            <InputField
              id="serviceHours"
              name="serviceHours"
              placeholder="Service Hours"
              value={formData.serviceHours}
              onChange={handleChange}
            />
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