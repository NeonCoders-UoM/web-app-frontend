"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import colors from "@/styles/colors";
import { ServiceCenter } from "@/types";

interface ServiceCenterFormProps {
  initialData?: Partial<ServiceCenter>;
  onSubmit: (data: Omit<ServiceCenter, "id">) => void;
}

export default function ServiceCenterForm({
  initialData,
  onSubmit,
}: ServiceCenterFormProps) {
  const [formData, setFormData] = useState<Omit<ServiceCenter, "id">>({
    serviceCenterName: "",
    Station_name: "",
    email: "",
    Email: "",
    address: "",
    Address: "",
    telephoneNumber: "",
    Telephone: "",
    ownersName: "",
    OwnerName: "",
    vatNumber: "",
    VATNumber: "",
    registrationNumber: "",
    RegisterationNumber: "",
    commissionRate: "",
    availableServices: [],
    Station_status: "Active",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<ServiceCenter, "id">, string>>
  >({});
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableServiceOptions = [
    "Oil Change",
    "Tire Replacement",
    "Brake Service",
    "Engine Repair",
    "Full Inspection",
  ];

  useEffect(() => {
    if (initialData) {
      setFormData((prevData) => ({
        ...prevData,
        ...initialData,
      }));
    }
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Sync both frontend and backend field names
      ...(name === "serviceCenterName" && { Station_name: value }),
      ...(name === "Station_name" && { serviceCenterName: value }),
      ...(name === "email" && { Email: value }),
      ...(name === "Email" && { email: value }),
      ...(name === "address" && { Address: value }),
      ...(name === "Address" && { address: value }),
      ...(name === "telephoneNumber" && { Telephone: value }),
      ...(name === "Telephone" && { telephoneNumber: value }),
      ...(name === "ownersName" && { OwnerName: value }),
      ...(name === "OwnerName" && { ownersName: value }),
      ...(name === "vatNumber" && { VATNumber: value }),
      ...(name === "VATNumber" && { vatNumber: value }),
      ...(name === "registrationNumber" && { RegisterationNumber: value }),
      ...(name === "RegisterationNumber" && { registrationNumber: value }),
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const availableServices = prev.availableServices || [];
      const updated = availableServices.includes(service)
        ? availableServices.filter((s) => s !== service)
        : [...availableServices, service];
      return { ...prev, availableServices: updated };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<ServiceCenter, "id">, string>> =
      {};
    const {
      serviceCenterName = "",
      email = "",
      address = "",
      telephoneNumber = "",
      ownersName = "",
      vatNumber = "",
      registrationNumber = "",
      commissionRate = "",
      availableServices = [],
    } = formData;

    if (!serviceCenterName.trim())
      newErrors.serviceCenterName = "Service Center Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!telephoneNumber.trim())
      newErrors.telephoneNumber = "Telephone Number is required";
    else if (!/^\d{10}$/.test(telephoneNumber))
      newErrors.telephoneNumber = "Telephone Number must be 10 digits";
    if (!ownersName.trim()) newErrors.ownersName = "Owner's Name is required";
    if (!vatNumber.trim()) newErrors.vatNumber = "VAT Number is required";
    if (!registrationNumber.trim())
      newErrors.registrationNumber = "Registration Number is required";
    if (!commissionRate.trim() || isNaN(Number(commissionRate)))
      newErrors.commissionRate = "Commission Rate must be a number";
    if (availableServices.length === 0)
      newErrors.availableServices = "Please select at least one service";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div style={{ width: "743px", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {[
            { id: "serviceCenterName", label: "Service Center Name" },
            { id: "email", label: "Email", type: "email" },
            { id: "address", label: "Address" },
            { id: "telephoneNumber", label: "Telephone Number" },
            { id: "ownersName", label: "Owner's Name" },
            { id: "vatNumber", label: "VAT Number" },
            { id: "registrationNumber", label: "Registration Number" },
            {
              id: "commissionRate",
              label: "Commission Rate (%)",
              type: "number",
            },
          ].map(({ id, label, type = "text" }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block mb-1"
                style={{ color: colors.neutral[600] }}
              >
                {label}
              </label>
              <InputField
                id={id}
                name={id}
                type={type}
                placeholder={label}
                value={
                  formData[id as keyof Omit<ServiceCenter, "id">] as string
                }
                onChange={handleChange}
              />
              {errors[id as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[id as keyof typeof errors]}
                </p>
              )}
            </div>
          ))}

          <div className="col-span-2 relative" ref={dropdownRef}>
            <label
              className="block mb-1"
              style={{ color: colors.neutral[600] }}
            >
              Available Services
            </label>
            <div
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="border border-neutral-600 rounded px-3 py-2 cursor-pointer"
            >
              {(formData.availableServices || []).length > 0
                ? (formData.availableServices || []).join(", ")
                : "Select services"}
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-48 overflow-auto">
                {availableServiceOptions.map((service) => (
                  <label
                    key={service}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.availableServices || []).includes(
                        service
                      )}
                      onChange={() => toggleService(service)}
                      className="mr-2"
                    />
                    {service}
                  </label>
                ))}
              </div>
            )}
            {errors.availableServices && (
              <p className="text-red-500 text-sm mt-1">
                {errors.availableServices}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 text-right">
          <Button type="submit" size="medium">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
