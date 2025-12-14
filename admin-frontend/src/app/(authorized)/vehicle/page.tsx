"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { deleteAllAuthCookies } from "@/utils/cookies";

import VehicleDetailsModal from "@/components/atoms/vehicle-details-card/vehicle-details-card";
import { fetchVehicles, deleteVehicle } from "@/utils/api";

export const dynamic = "force-dynamic";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceCenterId = searchParams.get("serviceCenterId");

  // const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const tableHeaders = [
    { title: "Vehicle ID", sortable: true },
    { title: "Customer ID", sortable: true },
    { title: "Model", sortable: true },
    { title: "Chassis Number", sortable: true },
    { title: "License Plate", sortable: true },
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

  console.log("VehiclesPage: Current vehicles state:", vehicles);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto w-full">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {serviceCenterId
              ? `Vehicles - Service Center ${serviceCenterId}`
              : "All Vehicles"}
          </h1>
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
        {isLoading ? (
          <div>Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/80 p-8 text-center">
            <p className="text-neutral-500">No vehicles found. Please check your connection or try again later.</p>
          </div>
        ) : (
          <div className="">
              <ClientTable
                headers={tableHeaders}
                data={vehicles.map((vehicle) => ({
                  id: vehicle.id,
                  vehicleid: vehicle.vehicleId.toString(),
                  customerid: vehicle.customerId.toString(),
                  model: vehicle.model,
                  chassisnumber: vehicle.chassisNumber,
                  licenseplate: vehicle.licenseplate,
                }))}
                actions={["view", "delete"]}
                showSearchBar={true}
                showClientCell={false}
                onActionSelect={handleActionSelect}
              />
          </div>
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
