// src/components/organism/document-upload-form/document-upload-form.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import UploadPhoto from "@/components/atoms/upload-photo/upload-photo";
import UploadFile from "@/components/atoms/upload-file/upload-file";
import colors from "@/styles/colors";

import { ServiceCenter } from "@/types";

interface DocumentUploadFormProps {
  initialData?: Partial<ServiceCenter>;
  onSubmit: (data: Omit<ServiceCenter, "id">) => void;
}

export default function DocumentUploadForm({ initialData, onSubmit }: DocumentUploadFormProps) {
  const [formData, setFormData] = useState<Omit<ServiceCenter, "id">>({
    serviceCenterName: "",
    email: "",
    address: "",
    telephoneNumber: "",
    ownersName: "",
    vatNumber: "",
    registrationNumber: "",
    commissionRate: "",
    availableServices: [],
    photoUrl: "",
    registrationCopyUrl: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<ServiceCenter, "id">, string>>>({});
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        commissionRate: "",
        availableServices: initialData.availableServices || [],
        photoUrl: initialData.photoUrl || "",
        registrationCopyUrl: initialData.registrationCopyUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    };

  const toggleService = (service: string) => {
    setFormData(prev => {
      const services = prev.availableServices || [];
      const updated = services.includes(service)
        ? services.filter(s => s !== service)
        : [...services, service];
      return { ...prev, availableServices: updated };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<ServiceCenter, "id">, string>> = {};

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
    if (!formData.ownersName?.trim()) {
      newErrors.ownersName = "Owner\'s Name is required";
    }
    if (!formData.vatNumber?.trim()) {
      newErrors.vatNumber = "VAT Number is required";
    }
    if (!formData.registrationNumber?.trim()) {
      newErrors.registrationNumber = "Registration Number is required";
    }
    if ((formData.availableServices || []).length === 0) {
      newErrors.availableServices = "At least one service must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedFormData = {
        ...formData,
        photoUrl: photo ? URL.createObjectURL(photo) : formData.photoUrl,
        registrationCopyUrl: file ? URL.createObjectURL(file) : formData.registrationCopyUrl,
      };
      onSubmit(updatedFormData);
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
      className="flex gap-[20px]"
      style={{
        width: "1056px",
        height: "738px",
        fontFamily: "var(--font-family-text)",
      }}
    >
      {/* Left Column - Upload Section */}
      <div
        className="bg-white px-[20px] py-[72px] rounded-lg shadow-sm border border-neutral-300"
        style={{
          width: "308px",
          height: "738px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="w-full mb-[52px]">
          <UploadPhoto onChange={setPhoto} />
        </div>
        <div className="w-full">
          <UploadFile onChange={setFile} />
        </div>
      </div>

      {/* Right Column - Form Section */}
      <div
        className="bg-white px-[16px] py-[24px] rounded-lg shadow-sm border border-neutral-300"
        style={{
          width: "768px",
          height: "738px",
        }}
      >
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-4">
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
          </div>

          <div className="mb-4">
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

          <div className="grid grid-cols-2 gap-4 mb-4">
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
                Owner&#39;s Name
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
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2 relative" ref={dropdownRef}>
            <label className="block mb-1" style={{ color: colors.neutral[600] }}>Available Services</label>
            <div onClick={() => setDropdownOpen(!isDropdownOpen)} className="border border-neutral-600 rounded px-3 py-2 cursor-pointer">
              {(formData.availableServices || []).length > 0 ? (formData.availableServices || []).join(", ") : "Select services"}
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-neutral-600 rounded shadow-md max-h-48 overflow-auto">
                {availableServiceOptions.map(service => (
                  <label key={service} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.availableServices || []).includes(service)}
                      onChange={() => toggleService(service)}
                      className="mr-2"
                    />
                    {service}
                  </label>
                ))}
              </div>
            )}
            {errors.availableServices && (
              <p className="text-red-500 text-sm mt-1">{errors.availableServices}</p>
            )}
          </div>
          </div>

          <div className="mt-auto flex justify-end">
            <Button type="submit" variant="primary" size="medium">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}