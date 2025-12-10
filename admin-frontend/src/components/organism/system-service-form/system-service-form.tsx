"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Loader2 } from "lucide-react";
import { SystemService, CreateSystemServiceDTO } from "@/types";

interface SystemServiceFormProps {
  initialData?: Partial<SystemService>;
  onSubmit: (data: CreateSystemServiceDTO) => void | Promise<void>;
  isEdit?: boolean;
}

export default function SystemServiceForm({
  initialData,
  onSubmit,
  isEdit = false,
}: SystemServiceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateSystemServiceDTO>({
    serviceName: "",
    description: "",
    category: "",
    basePrice: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        basePrice: initialData.basePrice || 0,
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
      [name]: name === "basePrice" ? Number(value) : value,
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
    if (formData.basePrice <= 0) {
      newErrors.basePrice = "Base Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-blue-600">Service Information</h2>
          <p className="text-sm text-gray-500">Fill in the details below to {isEdit ? 'update' : 'create'} a service</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Name */}
        <div>
          <label htmlFor="serviceName" className="block text-sm font-semibold text-gray-700 mb-2">
            Service Name 
          </label>
          <input
            id="serviceName"
            name="serviceName"
            type="text"
            placeholder="Enter service name"
            value={formData.serviceName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.serviceName && (
            <p className="text-red-500 text-sm mt-1">{errors.serviceName}</p>
          )}
        </div>

        {/* Service Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Service Description 
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter service description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
            Category 
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select the category that best describes this service
          </p>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Base Price */}
        <div>
          <label htmlFor="basePrice" className="block text-sm font-semibold text-gray-700 mb-2">
            Base Price (LKR) 
          </label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            placeholder="Enter base price"
            value={formData.basePrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">
            Base price must be greater than 0
          </p>
          {errors.basePrice && (
            <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/services")}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Wrench className="w-5 h-5" />
                {isEdit ? "Update Service" : "Create Service"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
