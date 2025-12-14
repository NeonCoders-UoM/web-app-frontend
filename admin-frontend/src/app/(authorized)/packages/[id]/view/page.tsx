"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import { fetchPackage } from "@/utils/api";
import { Package } from "@/types";
import { deleteAllAuthCookies } from "@/utils/cookies";

const ViewPackagePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPackage = async () => {
      if (typeof id === "string") {
        try {
          const packageInfo = await fetchPackage(parseInt(id));
          setPackageData(packageInfo);
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
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => {
              deleteAllAuthCookies();
              router.push("/login");
            }}
          />
      </div>

      <div className="px-[182px]">
        <div className="flex justify-between items-center mb-[32px]">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Package Details
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => router.push(`/packages/${id}/edit`)}
            >
              Edit Package
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push("/packages")}
            >
              Back to Packages
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Package Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Package Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">
                      Package ID
                    </label>
                    <p className="text-neutral-900 font-medium">
                      {packageData.packageId}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">
                      Package Name
                    </label>
                    <p className="text-neutral-900 font-medium">
                      {packageData.packageName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">
                      Loyalty Percentage
                    </label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {packageData.percentage}%
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        packageData.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {packageData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Description */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Description
              </h2>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-neutral-700 leading-relaxed">
                  {packageData.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-8 border-t border-neutral-200 flex justify-end space-x-4">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => router.push(`/packages/${id}/edit`)}
            >
              Edit Package
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push("/packages")}
            >
              Back to Packages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPackagePage;
