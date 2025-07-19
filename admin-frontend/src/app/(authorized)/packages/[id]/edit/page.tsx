"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import InputField from "@/components/atoms/input-fields/input-fields";
import { fetchPackage, updatePackage } from "@/utils/api";
import { Package, UpdatePackageDTO } from "@/types";

const EditPackagePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [packageData, setPackageData] = useState<Package | null>(null);
  const [formData, setFormData] = useState<UpdatePackageDTO>({
    packageName: "",
    percentage: 0,
    description: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPackage = async () => {
      if (typeof id === "string") {
        try {
          const packageInfo = await fetchPackage(parseInt(id));
          setPackageData(packageInfo);
          setFormData({
            packageName: packageInfo.packageName,
            percentage: packageInfo.percentage,
            description: packageInfo.description,
            isActive: packageInfo.isActive,
          });
        } catch (error) {
          console.error("Error fetching package:", error);
          alert("Failed to load package.");
          router.push("/packages");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadPackage();
  }, [id, router]);

  const handleInputChange = (
    field: keyof UpdatePackageDTO,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updatePackage(parseInt(id as string), formData);
      alert("Package updated successfully!");
      router.push("/packages");
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Failed to update package. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center p-6">
        <p className="text-neutral-900 text-lg">Package not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-end items-center mb-[32px]">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="Moni Roy"
          name="Moni Roy"
          role="super-admin"
          onLogout={() => router.push("/login")}
          onProfileClick={() => router.push("/profile")}
          onSettingsClick={() => router.push("/settings")}
        />
      </div>

      <div className="px-[182px]">
        <div className="flex justify-between items-center mb-[32px]">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Edit Package
          </h1>
          <Button
            variant="secondary"
            size="medium"
            onClick={() => router.push("/packages")}
          >
            Back to Packages
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Package Name *
              </label>
              <InputField
                type="text"
                placeholder="Enter package name"
                value={formData.packageName || ""}
                onChange={(e) =>
                  handleInputChange("packageName", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Loyalty Percentage *
              </label>
              <InputField
                type="number"
                placeholder="Enter loyalty percentage (0-100)"
                value={(formData.percentage || 0).toString()}
                onChange={(e) =>
                  handleInputChange("percentage", parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                Description *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter package description"
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive || false}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-neutral-600"
              >
                Active Package
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                size="medium"
                onClick={() => router.push("/packages")}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="medium"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPackagePage;
