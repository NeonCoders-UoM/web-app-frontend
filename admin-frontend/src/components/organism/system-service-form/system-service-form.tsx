"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import colors from "@/styles/colors";
import { SystemService, CreateSystemServiceDTO } from "@/types";

interface SystemServiceFormProps {
  initialData?: Partial<SystemService>;
  onSubmit: (data: CreateSystemServiceDTO) => void;
  isEdit?: boolean;
}

export default function SystemServiceForm({
  initialData,
  onSubmit,
  isEdit = false,
}: SystemServiceFormProps) {
  const [formData, setFormData] = useState<CreateSystemServiceDTO>({
    serviceName: "",
    description: "",
    category: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateSystemServiceDTO, string>>
  >({});

  const categoryOptions = [
    "Maintenance",
    "Tires",
    "Brakes",
    "Engine",
    "Inspection",
    "Electrical",
    "Body",
    "Interior",
    "Other",
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        serviceName: initialData.serviceName || "",
        description: initialData.description || "",
        category: initialData.category || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateSystemServiceDTO, string>> = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Service Name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Service Description is required";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

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
    <div style={{ width: "600px", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Service Name */}
          <div>
            <label
              htmlFor="serviceName"
              className="block mb-1"
              style={{ color: colors.neutral[600] }}
            >
              Service Name
            </label>
            <InputField
              id="serviceName"
              name="serviceName"
              placeholder="Enter service name"
              value={formData.serviceName}
              onChange={handleChange}
            />
            {errors.serviceName && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceName}</p>
            )}
          </div>

          {/* Service Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-1"
              style={{ color: colors.neutral[600] }}
            >
              Service Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter service description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block mb-1"
              style={{ color: colors.neutral[600] }}
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-right">
          <Button type="submit" size="medium">
            {isEdit ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
