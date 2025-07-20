"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import "@/styles/fonts.css";
import VehicleDetailsModal from "@/components/atoms/vehicle-details-card/vehicle-details-card";
import { fetchVehicles, deleteVehicle } from "@/utils/api";

interface Vehicle {
  id: string;
  vehicleId: number;
  customerId: number;
  client: string;
  clientEmail: string;
  pictureSrc: string;
  type: string;
  brand: string;
  model: string;
  licenseplate: string;
  registrationNumber: string;
  chassisNumber: string;
  mileage?: number;
  fuel: string;
  year: string;
}

const VehiclesPage = () => {
  const searchParams = useSearchParams();
  const serviceCenterId = searchParams.get("serviceCenterId");

  const [clientFilter, setClientFilter] = useState("All Clients");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const tableHeaders = [
    { title: "Id", sortable: true },
    { title: "Client", sortable: true },
    { title: "Type", sortable: true },
    { title: "Brand", sortable: true },
    { title: "Model", sortable: true },
    { title: "License Plate", sortable: true },
    { title: "Year", sortable: true },
    { title: "Fuel", sortable: true },
  ];

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        const vehicleData = await fetchVehicles();
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
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    switch (action.toLowerCase()) {
      case "view":
        setSelectedVehicle(vehicle || null);
        setIsModalOpen(true);
        break;
      case "loyalty points":
        console.log(`Viewing loyalty points for vehicle ID: ${vehicleId}`);
        break;
      case "delete":
        if (
          vehicle &&
          window.confirm(
            `Are you sure you want to delete ${vehicle.brand} ${vehicle.model} (${vehicle.licenseplate})?`
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

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-[58px]">
        <div className="flex justify-between items-center mb-[80px]">
          <h1 className="text-xl font-bold text-neutral-600">
            {serviceCenterId
              ? `Vehicles - Service Center ${serviceCenterId}`
              : "All Vehicles"}
          </h1>
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="Moni Roy"
            name="Moni Roy"
            role="admin"
            onLogout={() => console.log("Logout clicked")}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
          />
        </div>

        <div className="flex justify-between items-center mb-[36px]">
          <div className="relative">
            <select
              aria-label="Filter Clients"
              className="appearance-none bg-white border border-neutral-150 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="All Vehicles">All Vehicles</option>
              <option value="Active Vehicles">Active Vehicles</option>
              <option value="Inactive Vehicles">Inactive Vehicles</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div>Loading vehicles...</div>
        ) : (
          <ClientTable
            headers={tableHeaders}
            data={vehicles.map((vehicle) => ({
              id: vehicle.id,
              client: vehicle.client,
              type: vehicle.type,
              brand: vehicle.brand,
              model: vehicle.model,
              licenseplate: vehicle.licenseplate,
              year: vehicle.year,
              fuel: vehicle.fuel,
              // Add additional data for potential use
              vehicleid: vehicle.vehicleId.toString(),
              customerid: vehicle.customerId.toString(),
              registrationnumber: vehicle.registrationNumber,
              chassisnumber: vehicle.chassisNumber,
              mileage: vehicle.mileage?.toString() || "N/A",
            }))}
            actions={["view", "delete"]}
            showSearchBar={true}
            showClientCell={true}
            onActionSelect={handleActionSelect}
          />
        )}

        <VehicleDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicle={selectedVehicle}
        />
      </div>
    </div>
  );
};

export default VehiclesPage;
