"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ClientTable from "@/components/organism/client-table/client-table"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import "@/styles/fonts.css"
import VehicleDetailsModal from "@/components/atoms/vehicle-details-card/vehicle-details-card"

const VehiclesPage = () => {
  const router = useRouter()
  const [clientFilter, setClientFilter] = useState("All Clients")

  const tableHeaders = [
    { title: "Id", sortable: true },
    { title: "Client", sortable: true },
    { title: "Type", sortable: true },
    { title: "Brand", sortable: true },
    { title: "Model", sortable: true },
    { title: "License Plate", sortable: true },
  ];

  const vehicleData = [
    {
      id: "#0001",
      client: "Devon Lane",
      pictureSrc: "/placeholder.svg?height=40&width=40",
      type: "Coupe",
      brand: "Volvo",
      model: "Toyota Camry",
      licenseplate: "ABC-4564",
    },
    {
      id: "#0002",
      client: "Jane Smith",
      pictureSrc: "/images/devon.jpg",
      type: "Electric Vehicle",
      brand: "BMW",
      model: "Ford F-150",
      licenseplate: "GHI-9012",
    },
    {
      id: "#0003",
      client: "Sam Brown",
      pictureSrc: "/images/devon.jpg",
      type: "Hatchback",
      brand: "Bugatti",
      model: "Tesla Model S",
      licenseplate: "DEF-5678",
    },
    {
      id: "#0004",
      client: "Emily Davis",
      pictureSrc: "/images/devon.jpg",
      type: "Coupe",
      brand: "Acura",
      model: "Customer",
      licenseplate: "ABC-4998",
    },
    {
      id: "#0005",
      client: "John Carter",
      pictureSrc: "/images/devon.jpg",
      type: "Electric Vehicle",
      brand: "BMW",
      model: "Ford F-150",
      licenseplate: "MNO-7890",
    },
    {
      id: "#0006",
      client: "Alex Johnson",
      pictureSrc: "/images/devon.jpg",
      type: "Motorcycle",
      brand: "Cadillac",
      model: "Tesla Model S",
      licenseplate: "ABC-4987",
    },
    {
      id: "#0007",
      client: "Devon Lane",
      pictureSrc: "/images/devon.jpg",
      type: "Coupe",
      brand: "Volvo",
      model: "Chevrolet Silverado",
      licenseplate: "GHI-9176",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    id: string;
    client: string;
    pictureSrc: string;
    type: string;
    brand: string;
    model: string;
    licenseplate: string;
  } | null>(null);

  // Handler for kebab menu actions
  const handleActionSelect = (action: string, vehicleId: string) => {
    const vehicle = vehicleData.find((v) => v.id === vehicleId);

    switch (action.toLowerCase()) {
      case "view":
        setSelectedVehicle(vehicle || null);
        setIsModalOpen(true);
        break;
      case "edit":
        const numericId = vehicleId.replace("#", "").padStart(4, "0");
        router.push(`/vehicle/vehicle-${numericId}/edit`);
        break;
      case "loyalty points":
        console.log(`Viewing loyalty points for vehicle ID: ${vehicleId}`);
        break;
      case "delete":
        console.log(`Delete action for vehicle ID: ${vehicleId}`);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };



  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="h2 text-neutral-600">Vehicles</h1>

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

        {/* Client Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <select
              aria-label="Filter Clients"
              className="appearance-none bg-white border border-neutral-150 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="All Clients">All Clients</option>
              <option value="Active Clients">Active Clients</option>
              <option value="Inactive Clients">Inactive Clients</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Client Table */}
        <ClientTable
          headers={tableHeaders}
          data={vehicleData}
          actions={["view", "delete"]}
          showSearchBar={true}
          showClientCell={true}
          onActionSelect={handleActionSelect}
        />

        <VehicleDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicle={selectedVehicle}
        />

      </div>
    </div>
  )
}

export default VehiclesPage