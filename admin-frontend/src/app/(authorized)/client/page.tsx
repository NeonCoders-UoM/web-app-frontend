"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import { fetchClients } from "@/utils/api";
import { Client } from "@/types";

const ClientsPage = () => {
  const router = useRouter();
  const [clientFilter, setClientFilter] = useState("All Clients");
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const clients = await fetchClients();
        setClientsData(clients);
        console.log("Fetched clientsData:", clients); // Debug log
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
    // Normalize clientId to match the format expected by the routes (e.g., "client-1" instead of "#CLI-0001")
    const normalizedClientId = clientId.replace("#CLI-00", "client-");

    if (action === "View") {
      router.push(`/client/${normalizedClientId}`);
    } else if (action === "Edit") {
      router.push(`/client/${normalizedClientId}/edit`);
    } else if (action === "Loyalty Points") {
      console.log(`Viewing loyalty points for client with ID: ${clientId}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-neutral-600"></h1>
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
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
            data={clientsData as unknown as Record<string, string>[]} // Type assertion to resolve TypeScript error
            actions={["view", "edit", "delete"]}
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