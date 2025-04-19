"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/molecules/side-bar/side-bar"
import ClientTable from "@/components/organism/client-table/client-table"
import UserProfileCard from "@/components/molecules/user-card/user-card"

const ClientsPage = () => {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("Clients")
  const [clientFilter, setClientFilter] = useState("All Clients")

  const sidebarSections = [
    { label: "Dashboard" },
    { label: "Clients" },
    { label: "Vehicles" },
    { label: "Service Status" },
    { label: "Appointments" },
    { label: "Feedback" },
    { label: "Closure Schedule" },
  ]

  const handleSectionChange = (section: string) => {
    setActiveSection(section)

    // Convert section name to URL path
    const path = section.toLowerCase().replace(/\s+/g, "-")
    router.push(`/${path}`)
  }

  const tableHeaders = [
    { title: "Id", sortable: true },
    { title: "Client", sortable: true },
    { title: "Email", sortable: true },
    { title: "Phone No.", sortable: true },
    { title: "Address", sortable: true },
  ]

  const clientsData = [
    {
      id: "#CLI-0001",
      client: "Devon Lane",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "mariarodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "456 Ocean Avenue, Miami, FL 12345",
    },
    {
      id: "#CLI-0002",
      client: "Kathryn Murphy",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "juan.rodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "234 Oak Street, Flat 7",
    },
    {
      id: "#CLI-0003",
      client: "Eleanor Pena",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "mariarodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "234 Oak Street, Flat 7",
    },
    {
      id: "#CLI-0004",
      client: "Kathryn Murphy",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "juan.rodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "456 Ocean Avenue, Miami, FL 12345",
    },
    {
      id: "#CLI-0005",
      client: "Devon Lane",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "mariarodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "234 Oak Street, Flat 7",
    },
    {
      id: "#CLI-0006",
      client: "Eleanor Pena",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "mariarodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "234 Oak Street, Flat 7",
    },
    {
      id: "#CLI-0007",
      client: "Devon Lane",
      profilePicture: "/placeholder.svg?height=40&width=40",
      email: "juan.rodriguez@gmail.com",
      phoneno: "+1 (961) 523-4453",
      address: "456 Ocean Avenue, Miami, FL 12345",
    },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        sections={sidebarSections}
        logo="V PASS"
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-600">Clients</h1>
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

        {/* Client Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <select
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
          data={clientsData}
          actions={["view", "edit", "loyaltyPoints"]}
          showSearchBar={true}
          showClientCell={true}
        />
      </div>
    </div>
  )
}

export default ClientsPage
