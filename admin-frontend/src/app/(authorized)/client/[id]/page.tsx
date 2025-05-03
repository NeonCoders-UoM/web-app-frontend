"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Car } from "lucide-react"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import ProfileCard from "@/components/molecules/client-card/client-card"
import AvailablePointsCard from "@/components/molecules/available-points-card/available-points-card"
import TabNavigation from "@/components/atoms/tab-navigation/tab-navigation"
import VehicleDetails from "@/components/molecules/vehicle-details/vehicle-details"
import Button from "@/components/atoms/button/button"
import OrdersTable from "@/components/organism/service-history-table/service-history-table"
import AppointmentCard from "@/components/molecules/appoinment-cards/appoinment-cards"

// Define types to avoid using 'any'
interface Tier {
  name: string
  threshold: number
}

interface Vehicle {
  id: number
  type: string
  brand: string
  model: string
  year: string
  fuelType: string
  licensePlate: string
  transmission: string
  vin: string
}

interface ServiceHistoryItem {
  id: string
  title: string
  price: number
  originalPrice: number
  type: string
  date: string
  serviceCenter: string
  status: "Completed" | "Pending" | "Cancelled"
  image: string
}

interface Appointment {
  appointmentId: string
  owner: string
  licensePlate: string
  date: string
  vehicle: string
  services: string[]
  serviceCenter: string
}

interface ClientData {
  id: string
  name: string
  email: string
  nic: string
  phone: string
  address: string
  profilePicture: string
  points: number
  tiers: Tier[]
  vehicles: Vehicle[]
  serviceHistory: ServiceHistoryItem[]
  appointments: Appointment[]
}

const ClientProfilePage = () => {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string
  const [activeTab, setActiveTab] = useState(1)
  const [activeView, setActiveView] = useState<"serviceHistory" | "appointments">("serviceHistory")
  const [isLoading, setIsLoading] = useState(true)
  const [clientData, setClientData] = useState<ClientData | null>(null)

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with an actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get client name based on ID for more realistic data
        let clientName = "Devon Lane"
        if (clientId === "client-2" || clientId === "client-4") {
          clientName = "Kathryn Murphy"
        } else if (clientId === "client-3" || clientId === "client-6") {
          clientName = "Eleanor Pena"
        }

        // Mock client data
        setClientData({
          id: clientId,
          name: clientName,
          email: "mariarodriguez@gmail.com",
          nic: "2000345682",
          phone: "+1 (961) 523-4453",
          address: "456 Ocean Avenue, Miami, FL 12345",
          profilePicture: "/placeholder.svg?height=80&width=80",
          points: 13654,
          tiers: [
            { name: "Bronze", threshold: 5000 },
            { name: "Silver", threshold: 10000 },
            { name: "Gold", threshold: 20000 },
          ],
          vehicles: [
            {
              id: 1,
              type: "Honda",
              brand: "Amaze",
              model: "VX I-DTEC",
              year: "2007",
              fuelType: "Petrol",
              licensePlate: "KW - 4324",
              transmission: "Manual",
              vin: "JH4DA9350LS001234",
            },
            {
              id: 2,
              type: "Toyota",
              brand: "Corolla",
              model: "XLi",
              year: "2015",
              fuelType: "Petrol",
              licensePlate: "KW - 7890",
              transmission: "Automatic",
              vin: "JT2BF22K1W0123456",
            },
            {
              id: 3,
              type: "Nissan",
              brand: "Altima",
              model: "SV",
              year: "2018",
              fuelType: "Petrol",
              licensePlate: "KW - 1234",
              transmission: "CVT",
              vin: "1N4AL3AP8JC231456",
            },
          ],
          serviceHistory: [
            {
              id: "#20240001",
              title: "Engine Repair",
              price: 1200,
              originalPrice: 1500,
              type: "Product",
              date: "2024-10-23",
              serviceCenter: "AutoCare Hub",
              status: "Completed",
              image: "/placeholder.svg?height=40&width=40",
            },
            {
              id: "#20240002",
              title: "Battery Replacement",
              price: 300,
              originalPrice: 300,
              type: "Emergency",
              date: "2024-10-19",
              serviceCenter: "NextGen Motors",
              status: "Pending",
              image: "/placeholder.svg?height=40&width=40",
            },
            {
              id: "#20240003",
              title: "Oil Change",
              price: 80,
              originalPrice: 100,
              type: "Maintenance",
              date: "2024-09-15",
              serviceCenter: "Speed Motors",
              status: "Completed",
              image: "/placeholder.svg?height=40&width=40",
            },
          ],
          appointments: [
            {
              appointmentId: "SAPT-0005",
              owner: clientName,
              licensePlate: "KW - 4324",
              date: "Dec 23, 2024",
              vehicle: "Honda Amaze VX I-DTEC (2007)",
              services: ["Oil Change", "Brake Inspection", "Tire Rotation"],
              serviceCenter: "Speed Motors, Colombo",
            },
            {
              appointmentId: "SAPT-0007",
              owner: clientName,
              licensePlate: "KW - 7890",
              date: "Dec 25, 2024",
              vehicle: "Toyota Corolla XLi (2015)",
              services: ["Full Service", "AC Repair"],
              serviceCenter: "AutoCare Hub, Dehiwala",
            },
          ],
        })
      } catch (error) {
        console.error("Error fetching client data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientData()
  }, [clientId])

  const handleEditDetails = () => {
    const vehicleId = clientData?.vehicles[activeTab - 1]?.id
    router.push(`/vehicle/edit/${vehicleId}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6">
          <div className="text-center py-12">
            <p className="text-neutral-400">Client not found</p>
          </div>
        </div>
      </div>
    )
  }

  const activeVehicle = clientData.vehicles[activeTab - 1]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-600">Client Profile</h1>
          <UserProfileCard
            pictureSrc="/profile-picture.jpg"
            pictureAlt="Moni Roy"
            name="Moni Roy"
            role="admin"
            onLogout={() => console.log("Logout clicked")}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
          />
        </div>

        {/* Client Profile and Points Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <ProfileCard
            pictureSrc={clientData.profilePicture}
            pictureAlt={clientData.name}
            name={clientData.name}
            email={clientData.email}
            nic={clientData.nic}
            phone={clientData.phone}
            address={clientData.address}
          />
          <AvailablePointsCard points={clientData.points} tiers={clientData.tiers} />
        </div>

        {/* Vehicle Tabs and Details */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 mb-6">
          <div className="border-b border-neutral-100 p-2">
            <TabNavigation
              tabs={clientData.vehicles.map((vehicle, index) => ({
                label: `Vehicle ${index + 1}`,
                icon: <Car size={16} />,
              }))}
              activeTab={`Vehicle ${activeTab}`}
              onTabChange={(label) => {
                const index = Number.parseInt(label.replace("Vehicle ", ""))
                setActiveTab(index)
              }}
            />
          </div>

          {activeVehicle && (
            <VehicleDetails
              vehicleType={activeVehicle.type}
              vehicleBrand={activeVehicle.brand}
              vin={activeVehicle.vin}
              vehicleModel={activeVehicle.model}
              year={activeVehicle.year}
              fuelType={activeVehicle.fuelType}
              licensePlate={activeVehicle.licensePlate}
              transmission={activeVehicle.transmission}
              onEditDetails={handleEditDetails}
            />
          )}
        </div>

        {/* Service History / Appointments Toggle */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeView === "serviceHistory" ? "primary" : "primary"}
            size="small"
            onClick={() => setActiveView("serviceHistory")}
            className={activeView !== "serviceHistory" ? "bg-white text-primary-200 border border-primary-200" : ""}
          >
            Service History
          </Button>
          <Button
            variant={activeView === "appointments" ? "primary" : "primary"}
            size="small"
            onClick={() => setActiveView("appointments")}
            className={activeView !== "appointments" ? "bg-white text-primary-200 border border-primary-200" : ""}
          >
            Check Appointment Status
          </Button>
        </div>

        {/* Service History or Appointments View */}
        {activeView === "serviceHistory" ? (
          <div>
            <h2 className="text-xl font-semibold text-neutral-600 mb-4">Service History</h2>
            <OrdersTable orders={clientData.serviceHistory} showSearchBar={true} />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-neutral-600 mb-4">Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientData.appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.appointmentId}
                  appointmentId={appointment.appointmentId}
                  owner={appointment.owner}
                  licensePlate={appointment.licensePlate}
                  date={appointment.date}
                  vehicle={appointment.vehicle}
                  services={appointment.services}
                  //serviceCenter={appointment.serviceCenter}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientProfilePage