"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import UserProfileCard from "@/components/molecules/user-card/user-card"
import CustomerUpdateForm from "@/components/organism/customer-update-form/customer-update-form"
import colors from "@/styles/colors"

interface ClientData {
  id: string
  name: string
  email: string
  nic: string
  phone: string
  address: string
  profilePicture: string
}

const ClientEditPage = () => {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [clientData, setClientData] = useState<ClientData | null>(null)

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        let clientName = "Devon Lane"
        if (clientId === "client-2" || clientId === "client-4") {
          clientName = "Kathryn Murphy"
        } else if (clientId === "client-3" || clientId === "client-6") {
          clientName = "Eleanor Pena"
        }

        setClientData({
          id: clientId,
          name: clientName,
          email: "mariarodriguez@gmail.com",
          nic: "2000345682",
          phone: "+1 (961) 523-4453",
          address: "456 Ocean Avenue, Miami, FL 12345",
          profilePicture: "https://placehold.co/80x80/svg?text=Client",
        })
      } catch (error) {
        console.error("Error fetching client data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientData()
  }, [clientId])

  const handleFormSubmit = (data: {
    customerName: string
    email: string
    nicNumber: string
    telephoneNumber: string
    address: string
    photo: File | null
  }) => {
    console.log("Updating client with data:", data)
    router.push(`/client/${clientId}`)
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

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-xl font-bold"
            style={{ color: colors.primary[200] }}
          >
            V-PASS
          </h1>
          <UserProfileCard
            pictureSrc="/images/profipic.jpg" // Already updated to use local image
            pictureAlt="Moni Roy"
            name="Moni Roy"
            role="admin"
            onLogout={() => console.log("Logout clicked")}
            onProfileClick={() => console.log("Profile clicked")}
            onSettingsClick={() => console.log("Settings clicked")}
          />
        </div>

        {/* Page Title */}
        <h2 className="text-2xl font-bold text-neutral-600 mb-6">
          Edit Customer Details
        </h2>

        {/* Customer Update Form */}
        <div className="flex justify-center">
          <CustomerUpdateForm
            initialData={{
              customerName: clientData.name,
              email: clientData.email,
              nicNumber: clientData.nic,
              telephoneNumber: clientData.phone,
              address: clientData.address,
              photo: null,
            }}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientEditPage