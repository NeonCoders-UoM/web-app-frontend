"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { createServiceRequest } from "@/utils/api";
import { CreateServiceRequestDTO } from "@/types";
import { deleteAllAuthCookies } from "@/utils/cookies";
import { getAuthUser } from "@/utils/auth";

export const dynamic = "force-dynamic";

const RequestServicePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const serviceCenterId = params.id as string;
  
  const [formData, setFormData] = useState<CreateServiceRequestDTO>({
    serviceName: "",
    description: "",
    category: "",
    customPrice: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateServiceRequestDTO, string>>>({});

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
    // Verify user is service center admin
    const user = getAuthUser();
    if (!user || user.userRole !== "ServiceCenterAdmin") {
      alert("Unauthorized access. Only Service Center Admins can request services.");
      router.push("/login");
      return;
    }

    // Verify the service center ID matches the user's station ID
    if (user.stationId && user.stationId !== serviceCenterId) {
      alert("You can only request services for your own service center.");
      router.push(`/service-center-dashboard/${user.stationId}`);
      return;
    }
  }, [serviceCenterId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "customPrice" ? (value ? parseFloat(value) : undefined) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateServiceRequestDTO, string>> = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Service Name is required";
    }
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Service Description is required";
    }
    if (!formData.category || !formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createServiceRequest(formData);
      alert("Service request submitted successfully! An admin will review it soon.");
      router.push(`/service-center-dashboard/${serviceCenterId}/my-requests`);
    } catch (error) {
      console.error("Error submitting service request:", error);
      alert("Failed to submit service request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}/my-requests`)}
          className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Back to Requests</span>
        </button>

        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            deleteAllAuthCookies();
            router.push("/login");
          }}
        />
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-600">Request New Service</h2>
            <p className="text-sm text-gray-500">Submit a request to add a new service to the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label htmlFor="serviceName" className="block text-sm font-semibold text-gray-700 mb-2">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                id="serviceName"
                name="serviceName"
                type="text"
                placeholder="e.g., Full Car Wash, Engine Tune-Up"
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
                Service Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the service"
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
                Category <span className="text-red-500">*</span>
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
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Custom Price */}
            <div>
              <label htmlFor="customPrice" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Custom Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  id="customPrice"
                  name="customPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g., 50.00"
                  value={formData.customPrice || ""}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Specify your desired custom price for this service at your center. The admin will still set the base price.
              </p>
              {errors.customPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.customPrice}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your request will be reviewed by a SuperAdmin who will set the base price. If you specify a custom price, it will be automatically applied to your service center after approval.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/service-center-dashboard/${serviceCenterId}`)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestServicePage;
