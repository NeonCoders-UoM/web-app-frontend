"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import Table from "@/components/organism/table/table";
import { fetchPackages, deletePackage } from "@/utils/api";
import { Package } from "@/types";

const PackagesPage: React.FC = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const packagesData = await fetchPackages();
        setPackages(packagesData);
      } catch (error) {
        console.error("Error fetching packages:", error);
        alert("Failed to load packages.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPackages();
  }, []);

  const data = packages.map((pkg) => [
    pkg.packageId.toString(),
    pkg.packageName,
    `${pkg.percentage}%`,
    pkg.description,
    pkg.isActive ? "Active" : "Inactive",
  ]);

  const headers = [
    { title: "ID", sortable: false },
    { title: "Package Name", sortable: false },
    { title: "Loyalty Percentage", sortable: false },
    { title: "Description", sortable: false },
    { title: "Status", sortable: false },
  ];

  const actions: ("edit" | "delete" | "view")[] = ["edit", "delete", "view"];

  const handleEdit = (id: string) => {
    router.push(`/packages/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage(parseInt(id));
        setPackages((prev) =>
          prev.filter((pkg) => pkg.packageId.toString() !== id)
        );
        alert("Package deleted successfully!");
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("Failed to delete package.");
      }
    }
  };

  const handleView = (id: string) => {
    router.push(`/packages/${id}/view`);
  };

  const handleAction = (action: string, row: string[]) => {
    const id = row[0];
    if (!id || id.trim() === "") {
      console.error("Invalid ID for action:", id);
      alert("Unable to perform action: Invalid package ID");
      return;
    }

    const actionMap: Record<string, string> = {
      Edit: "edit",
      Delete: "delete",
      View: "view",
    };
    const actionType = actionMap[action];
    if (actionType === "edit") handleEdit(id);
    if (actionType === "delete") handleDelete(id);
    if (actionType === "view") handleView(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-end items-center mb-6">
        <UserProfileCard
          pictureSrc="/images/profipic.jpg"
          pictureAlt="User Profile"
          useCurrentUser={true}
          onLogout={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Packages</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push("/packages/add")}
            >
              Add Package
            </Button>
          </div>
        </div>

        <div>
          <Table
            headers={headers}
            data={data}
            actions={actions}
            showSearchBar={true}
            onAction={handleAction}
          />
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
