"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import "@/styles/fonts.css";
import { fetchVehicles, deleteVehicle, VehicleBasic } from "@/utils/api";

// Use VehicleBasic from api.ts
const VehiclesPage = () => {
  const searchParams = useSearchParams();
  const serviceCenterId = searchParams.get("serviceCenterId");

  const [clientFilter, setClientFilter] = useState("All Clients");
  const [vehicles, setVehicles] = useState<VehicleBasic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tableHeaders = [
    { title: "Vehicle ID", sortable: true },
    { title: "Customer ID", sortable: true },
    { title: "Model", sortable: true },
    { title: "Chassis Number", sortable: true },
    { title: "Mileage", sortable: true },
  ];

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching vehicles...");
        const vehicleData = await fetchVehicles();
        console.log("Vehicle data received:", vehicleData);
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadVehicles();
  }, []);

  const handleActionSelect = async (action: string, vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.vehicleId.toString() === vehicleId);

    switch (action.toLowerCase()) {
      case "view":
        // setSelectedVehicle(vehicle || null); // This line is removed
        // setIsModalOpen(true); // This line is removed
        break;
      case "loyalty points":
        console.log(`Viewing loyalty points for vehicle ID: ${vehicleId}`);
        break;
      case "delete":
        if (
          vehicle &&
          window.confirm(
            `Are you sure you want to delete vehicle ID: ${vehicleId}?`
          )
        ) {
          try {
            setIsLoading(true);
            await deleteVehicle(vehicle.customerId, vehicle.vehicleId);
            // Refresh the vehicles list
            const updatedVehicles = await fetchVehicles();
            setVehicles(updatedVehicles);
            console.log(`Vehicle ${vehicleId} deleted successfully`);
          } catch (error) {
            console.error(`Error deleting vehicle ${vehicleId}:`, error);
            alert("Failed to delete vehicle. Please try again.");
          } finally {
            setIsLoading(false);
          }
        }
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  console.log("VehiclesPage: Current vehicles state:", vehicles);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto w-full">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold text-neutral-600">
            {serviceCenterId
              ? `Vehicles - Service Center ${serviceCenterId}`
              : "All Vehicles"}
          </h1>
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          />
        </div>

        {/* Removed filter dropdown for vehicles */}

        {isLoading ? (
          <div>Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/80 p-8 text-center">
            <p className="text-neutral-500">No vehicles found. Please check your connection or try again later.</p>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/80 overflow-x-auto">
              <ClientTable
                headers={tableHeaders}
                data={vehicles.map((vehicle) => ({
                  vehicleid: vehicle.vehicleId.toString(),
                  customerid: vehicle.customerId.toString(),
                  model: vehicle.model,
                  chassisnumber: vehicle.chassisNumber,
                  mileage: vehicle.mileage.toString(),
                }))}
                actions={[]}
                showSearchBar={true}
                showClientCell={false}
                onActionSelect={handleActionSelect}
                showFilterButton={false}
              />
          </div>
        )}

        {/* VehicleDetailsModal is removed */}
      </div>
    </div>
  );
};

export default VehiclesPage;
