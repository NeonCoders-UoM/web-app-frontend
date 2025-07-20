"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchClients } from "@/utils/api";

// Interface for transformed client data that matches table expectations
interface TransformedClient {
  id: string;
  client: string;
  email: string;
  phoneno: string;
  address: string;
  customerId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nic?: string;
  loyaltyPoints?: number;
  points?: number;
  profilePicture?: string;
  pictureSrc?: string;
}

const ClientsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceCenterId = searchParams.get("serviceCenterId");

  const [clientFilter, setClientFilter] = useState("All Clients");
  const [clientsData, setClientsData] = useState<TransformedClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const clients = await fetchClients();

        // Transform client data to match table column expectations
        const transformedClients: TransformedClient[] = clients.map(
          (client) => {
            const result = {
              id: client.id || `client-${client.customerId}`,
              client: client.client || `${client.firstName} ${client.lastName}`,
              email: client.email,
              phoneno: client.phoneno || client.phoneNumber,
              address: client.address || "", // Temporary test address
              // Include other properties that might be needed
              customerId: client.customerId,
              firstName: client.firstName,
              lastName: client.lastName,
              phoneNumber: client.phoneNumber,
              nic: client.nic,
              loyaltyPoints: client.loyaltyPoints,
              points: client.points || client.loyaltyPoints,
              profilePicture: client.profilePicture,
              pictureSrc: client.profilePicture,
            };

            // Debug each client's address field
            console.log(
              `Client ${result.client} - Address: "${result.address}"`
            );
            return result;
          }
        );

        setClientsData(transformedClients);
        console.log("Fetched and transformed clientsData:", transformedClients); // Debug log
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const tableHeaders = [
    { title: "Id", sortable: true },
    { title: "Client", sortable: true },
    { title: "Email", sortable: true },
    { title: "Phone No.", sortable: true },
    { title: "Address", sortable: true },
  ];

  // Handler for kebab menu actions
  const handleActionSelect = (action: string, clientId: string) => {
    // Handle both new format (client-X) and backend format (customerId)
    let normalizedClientId = clientId;

    // If it's already in client-X format, use as is
    if (!clientId.startsWith("client-")) {
      // If it's a numeric ID or other format, convert to client-X
      const numericId = clientId.replace(/\D/g, ""); // Extract numbers only
      normalizedClientId = `client-${numericId}`;
    }

    if (action === "View") {
      router.push(`/client/${normalizedClientId}`);
    } else if (action === "Loyalty Points") {
      console.log(`Viewing loyalty points for client with ID: ${clientId}`);
    } else if (action === "Delete") {
      // Handle delete action
      console.log(`Deleting client with ID: ${clientId}`);
      // You can implement delete functionality here
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-neutral-600">
            {serviceCenterId
              ? `Clients - Service Center ${serviceCenterId}`
              : "All Clients"}
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

        {/* Client Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
          </div>
        ) : (
          <ClientTable
            headers={tableHeaders}
            data={clientsData as unknown as Record<string, string>[]}
            actions={["view", "delete"]}
            showSearchBar={true}
            showClientCell={true}
            onActionSelect={handleActionSelect}
          />
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
