"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/button/button";
import { ServiceCenter } from "@/types";
import {
  fetchServiceCenters,
  deleteServiceCenter,
  updateServiceCenterStatus,
} from "@/utils/api";

const ServiceCentersPage: React.FC = () => {
  const router = useRouter();
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [filteredServiceCenters, setFilteredServiceCenters] = useState<
    ServiceCenter[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const loadServiceCenters = useCallback(async () => {
    try {
      setLoading(true);
      // Always fetch all service centers from backend
      const data = await fetchServiceCenters();
      console.log("Loaded service centers:", data);
      setServiceCenters(data);
    } catch (error) {
      console.error("Error loading service centers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterServiceCenters = useCallback(() => {
    let filtered = serviceCenters;
    console.log("Filtering from serviceCenters:", serviceCenters);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (sc) =>
          (sc.serviceCenterName || sc.Station_name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (sc.ownersName || sc.OwnerName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (sc.email || sc.Email || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (sc.address || sc.Address || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (sc) =>
          (sc.Station_status || "Active").toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    console.log("Filtered service centers:", filtered);
    setFilteredServiceCenters(filtered);
  }, [serviceCenters, searchTerm, statusFilter]);

  useEffect(() => {
    loadServiceCenters();
  }, [loadServiceCenters]);

  useEffect(() => {
    filterServiceCenters();
  }, [filterServiceCenters]);

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this service center?")
    ) {
      try {
        await deleteServiceCenter(id);
        await loadServiceCenters();
      } catch (error) {
        console.error("Error deleting service center:", error);
        alert("Failed to delete service center");
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await updateServiceCenterStatus(id, newStatus);
      await loadServiceCenters();
    } catch (error) {
      console.error("Error updating service center status:", error);
      alert("Failed to update service center status");
    }
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "Active";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Service Centers
            </h1>
            <p className="text-gray-600">
              Manage and monitor service center locations
            </p>
          </div>
          <Button
            variant="primary"
            size="medium"
            onClick={() => router.push("/service-centers/add")}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Service Center
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search service centers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Service Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServiceCenters.map((serviceCenter) => (
            <div
              key={serviceCenter.id || serviceCenter.Station_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {serviceCenter.serviceCenterName ||
                      serviceCenter.Station_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Owner: {serviceCenter.ownersName || serviceCenter.OwnerName}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === serviceCenter.id
                          ? null
                          : serviceCenter.id ||
                              serviceCenter.Station_id?.toString() ||
                              ""
                      )
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                  {activeDropdown ===
                    (serviceCenter.id ||
                      serviceCenter.Station_id?.toString()) && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <div className="py-1">
                        <button
                          onClick={() =>
                            router.push(
                              `/service-centers/${
                                serviceCenter.id || serviceCenter.Station_id
                              }/view`
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/service-centers/${
                                serviceCenter.id || serviceCenter.Station_id
                              }/edit`
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleStatusToggle(
                              serviceCenter.id ||
                                serviceCenter.Station_id?.toString() ||
                                "",
                              serviceCenter.Station_status || "Active"
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              serviceCenter.id ||
                                serviceCenter.Station_id?.toString() ||
                                ""
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Email:</span>
                  {serviceCenter.email || serviceCenter.Email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Phone:</span>
                  {serviceCenter.telephoneNumber || serviceCenter.Telephone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Address:</span>
                  <span className="truncate">
                    {serviceCenter.address || serviceCenter.Address}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">VAT Number:</span>
                  {serviceCenter.vatNumber || serviceCenter.VATNumber}
                </div>
              </div>

              <div className="flex justify-between items-center">
                {getStatusBadge(serviceCenter.Station_status || "Active")}
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() =>
                    router.push(
                      `/service-centers/${
                        serviceCenter.id || serviceCenter.Station_id
                      }/view`
                    )
                  }
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredServiceCenters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No service centers found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first service center"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCentersPage;
