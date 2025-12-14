"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { createPackage } from "@/utils/api";
import { CreatePackageDTO } from "@/types";
import { deleteAllAuthCookies } from "@/utils/cookies";

const AddPackagePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreatePackageDTO>({
    packageName: "",
    percentage: 0,
    description: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    field: keyof CreatePackageDTO,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.packageName.trim()) {
      alert("Please enter package name");
      return;
    }
    if (formData.percentage < 0 || formData.percentage > 100) {
      alert("Percentage must be between 0 and 100");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter package description");
      return;
    }

    setIsLoading(true);

    try {
      await createPackage(formData);
      alert("Package created successfully!");
      router.push("/packages");
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Failed to create package. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/packages")}
          className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all m hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Back to Packages</span>
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
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-blue-600">Package Information</h2>
              <p className="text-sm text-gray-500">Fill in the details below to create a new loyalty package</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Package Name 
              </label>
              <input
                type="text"
                value={formData.packageName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, packageName: e.target.value }))
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter package name"
              />
            </div>

            {/* Loyalty Percentage */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loyalty Percentage 
              </label>
              <input
                type="number"
                value={formData.percentage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, percentage: parseInt(e.target.value) || 0 }))
                }
                required
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter loyalty percentage (0-100)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentage value must be between 0 and 100
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description 
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter package description"
              />
            </div>

            {/* Active Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Active Package
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-2 ml-8">
                Only active packages will be visible to customers
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/packages")}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Create Package
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPackagePage;
