"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import Table from "@/components/organism/table/table";
import Sidebar from "@/components/molecules/side-bar/side-bar";
import {
  fetchEmergencyCallCenters,
  deleteEmergencyCallCenter,
  createEmergencyCallCenter,
  updateEmergencyCallCenter,
  fetchEmergencyCallCenterById,
} from "@/utils/api";
import { EmergencyCallCenter, CreateEmergencyCallCenterDTO } from "@/types";

const EmergencyCallCentersPage: React.FC = () => {
  const router = useRouter();
  const [centers, setCenters] = useState<EmergencyCallCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCenter, setEditingCenter] = useState<EmergencyCallCenter | null>(null);
  const [formData, setFormData] = useState<CreateEmergencyCallCenterDTO>({
    name: "",
    address: "",
    registrationNumber: "",
    phoneNumber: "",
  });

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      const data = await fetchEmergencyCallCenters();
      console.log("Fetched emergency call centers:", data);
      setCenters(data);
    } catch (error) {
      console.error("Error fetching emergency call centers:", error);
      alert("Failed to load emergency call centers.");
    } finally {
      setIsLoading(false);
    }
  };

  const data = centers.map((center) => [
    center.centerId.toString(),
    center.name,
    center.address,
    center.registrationNumber,
    center.phoneNumber,
  ]);

  const headers = [
    { title: "ID", sortable: false },
    { title: "Name", sortable: false },
    { title: "Address", sortable: false },
    { title: "Registration Number", sortable: false },
    { title: "Phone Number", sortable: false },
  ];

  const actions: ("edit" | "delete" | "view")[] = ["edit", "delete", "view"];

  const handleEdit = async (id: string) => {
    try {
      const center = await fetchEmergencyCallCenterById(parseInt(id));
      setEditingCenter(center);
      setFormData({
        name: center.name,
        address: center.address,
        registrationNumber: center.registrationNumber,
        phoneNumber: center.phoneNumber,
      });
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching emergency call center:", error);
      alert("Failed to load emergency call center details.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this emergency call center?")) {
      try {
        await deleteEmergencyCallCenter(parseInt(id));
        setCenters((prev) => prev.filter((c) => c.centerId !== parseInt(id)));
        alert("Emergency call center deleted successfully!");
      } catch (error) {
        console.error("Error deleting emergency call center:", error);
        alert("Failed to delete emergency call center.");
      }
    }
  };

  const handleView = (id: string) => {
    const center = centers.find((c) => c.centerId === parseInt(id));
    if (center) {
      alert(`
Emergency Call Center Details:
ID: ${center.centerId}
Name: ${center.name}
Address: ${center.address}
Registration Number: ${center.registrationNumber}
Phone Number: ${center.phoneNumber}
      `);
    }
  };

  const handleAction = (action: string, row: string[]) => {
    const id = row[0];
    if (!id || id.trim() === "") {
      alert("Unable to perform action: Invalid emergency call center ID");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.address || !formData.registrationNumber || !formData.phoneNumber) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingCenter) {
        // Update existing center
        const updated = await updateEmergencyCallCenter(editingCenter.centerId, formData);
        setCenters((prev) =>
          prev.map((c) => (c.centerId === editingCenter.centerId ? updated : c))
        );
        alert("Emergency call center updated successfully!");
        setShowEditModal(false);
      } else {
        // Create new center
        const newCenter = await createEmergencyCallCenter(formData);
        setCenters((prev) => [...prev, newCenter]);
        alert("Emergency call center created successfully!");
        setShowAddModal(false);
      }
      
      // Reset form
      setFormData({
        name: "",
        address: "",
        registrationNumber: "",
        phoneNumber: "",
      });
      setEditingCenter(null);
    } catch (error) {
      console.error("Error saving emergency call center:", error);
      alert("Failed to save emergency call center.");
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingCenter(null);
    setFormData({
      name: "",
      address: "",
      registrationNumber: "",
      phoneNumber: "",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      <Sidebar role="super-admin" serviceCenters={[]} />
      <div className="max-w-full mx-auto ">
        <div className="flex justify-end items-center mb-10">
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => router.push("/login")}
          />
        </div>

        <div className="">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
                Emergency Call Centers Management
                <p className="text-sm font-light text-gray-600 mt-2">
                  Manage emergency service call centers and their registrations
                </p>
              </h1>
            </div>
            <Button
              variant="primary"
              size="medium"
              onClick={() => setShowAddModal(true)}
            >
              Add Emergency Call Center
            </Button>
          </div>

          <div className="">
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

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingCenter ? "Edit Emergency Call Center" : "Add Emergency Call Center"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </Button>
                <Button variant="primary" size="medium" type="submit">
                  {editingCenter ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyCallCentersPage;
