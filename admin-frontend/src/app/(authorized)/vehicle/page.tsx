"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ClientTable from "@/components/organism/client-table/client-table"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import "@/styles/fonts.css"
import VehicleDetailsModal from "@/components/atoms/vehicle-details-card/vehicle-details-card"
import { fetchVehicles } from "@/utils/api"

interface Vehicle {
  id: string;
  client: string;
  pictureSrc: string;
  type: string;
  brand: string;
  model: string;
  licenseplate: string;
}

const VehiclesPage = () => {
  const router = useRouter()
  const [clientFilter, setClientFilter] = useState("All Clients")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const tableHeaders = [
    { title: "Id", sortable: true },
    { title: "Client", sortable: true },
    { title: "Type", sortable: true },
    { title: "Brand", sortable: true },
    { title: "Model", sortable: true },
    { title: "License Plate", sortable: true },
  ]

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true)
        const vehicleData = await fetchVehicles()
        setVehicles(vehicleData)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadVehicles()
  }, [])

  const handleActionSelect = (action: string, vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)

    switch (action.toLowerCase()) {
      case "view":
        setSelectedVehicle(vehicle || null)
        setIsModalOpen(true)
        break
      case "edit":
        const numericId = vehicleId.replace("#", "").padStart(4, "0")
        router.push(`/vehicle/vehicle-${numericId}/edit`)
        break
      case "loyalty points":
        console.log(`Viewing loyalty points for vehicle ID: ${vehicleId}`)
        break
      case "delete":
        console.log(`Delete action for vehicle ID: ${vehicleId}`)
        break
      default:
        console.warn("Unknown action:", action)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-[58px]">
        <div className="flex justify-end items-center mb-[80px]">
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
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
            data={vehicles.map(vehicle => ({
              id: vehicle.id,
              client: vehicle.client,
              type: vehicle.type,
              brand: vehicle.brand,
              model: vehicle.model,
              licenseplate: vehicle.licenseplate,
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
  )
}

export default VehiclesPage