"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import { fetchSystemServices } from "@/utils/api";
import { SystemService } from "@/types";
import colors from "@/styles/colors";

interface ServiceCenterServiceAddFormProps {
  onSubmit?: (data: { 
    serviceId: number; 
    serviceName: string; 
    customPrice: number; 
    loyaltyPoints: number;
    isAvailable: boolean;
  }) => void;
  buttonLabel?: string;
}

export default function ServiceCenterServiceAddForm({ 
  onSubmit, 
  buttonLabel = "Add Service" 
}: ServiceCenterServiceAddFormProps) {
  const [systemServices, setSystemServices] = useState<SystemService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(0);
  const [formData, setFormData] = useState({
    customPrice: "",
    loyaltyPoints: "0",
    isAvailable: true,
  });

  useEffect(() => {
    const loadSystemServices = async () => {
      try {
        const services = await fetchSystemServices();
        setSystemServices(services);
        if (services.length > 0) {
          setSelectedServiceId(services[0].serviceId);
        }
      } catch (error) {
        console.error("Error loading system services:", error);
      }
    };

    loadSystemServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServiceId(parseInt(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServiceId === 0) {
      alert("Please select a service");
      return;
    }

    const selectedService = systemServices.find(s => s.serviceId === selectedServiceId);
    if (!selectedService) {
      alert("Selected service not found");
      return;
    }

    console.log("Form submitted:", {
      serviceId: selectedServiceId,
      serviceName: selectedService.serviceName,
      customPrice: parseFloat(formData.customPrice) || 0,
      loyaltyPoints: parseInt(formData.loyaltyPoints) || 0,
      isAvailable: formData.isAvailable,
    });

    if (onSubmit) {
      onSubmit({
        serviceId: selectedServiceId,
        serviceName: selectedService.serviceName,
        customPrice: parseFloat(formData.customPrice) || 0,
        loyaltyPoints: parseInt(formData.loyaltyPoints) || 0,
        isAvailable: formData.isAvailable,
      });
    }
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-family-text)",
        padding: "20px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          {/* Left Column: Service Selection and Price */}
          <div className="flex flex-col space-y-6">
            {/* Service Selection */}
            <div>
              <label
                htmlFor="serviceId"
                className="block mb-1"
                style={{
                  color: colors.neutral[600],
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                Select Service
              </label>
              <select
                id="serviceId"
                name="serviceId"
                value={selectedServiceId}
                onChange={handleServiceChange}
                className="w-full p-2 border border-neutral-150 rounded-md text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
                required
              >
                <option value={0}>Select a service...</option>
                {systemServices.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName} - {service.description}
                  </option>
                ))}
              </select>
            </div>

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
                Custom Price (LKR)
              </label>
              <InputField
                id="customPrice"
                name="customPrice"
                type="number"
                placeholder="Enter custom price"
                value={formData.customPrice}
                onChange={handleChange}
               
              />
            </div>
          </div>

          {/* Right Column: Loyalty Points and Availability */}
          <div className="flex flex-col space-y-6">
            

            {/* Availability */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="rounded border-neutral-150 text-primary-200 focus:ring-primary-200"
                />
                <span
                  style={{
                    color: colors.neutral[600],
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-regular)",
                  }}
                >
                  Service Available
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="medium"
          >
            {buttonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
} 