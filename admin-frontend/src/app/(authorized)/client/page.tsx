"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchClients } from "@/utils/api";
import { deleteAllAuthCookies } from "@/utils/cookies";

export const dynamic = "force-dynamic";

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

  // const [clientFilter, setClientFilter] = useState("All Clients");
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
    } else if (action === "Edit") {
      router.push(`/client/${normalizedClientId}/edit`);
    } else if (action === "Loyalty Points") {
      console.log(`Viewing loyalty points for client with ID: ${clientId}`);
    } else if (action === "Delete") {
      // Handle delete action
      console.log(`Deleting client with ID: ${clientId}`);
      // You can implement delete functionality here
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      {/* Main Content */}
      <div className="w-full">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {serviceCenterId
              ? `Clients - Service Center ${serviceCenterId}`
              : "All Clients"}
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
        <div className="w-full">
          {/* Client Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ClientTable
              headers={tableHeaders}
              data={clientsData as unknown as Record<string, string>[]}
              // actions={["view", "edit", "delete"]}
              actions={[]}
              showSearchBar={true}
              showClientCell={true}
              onActionSelect={handleActionSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
