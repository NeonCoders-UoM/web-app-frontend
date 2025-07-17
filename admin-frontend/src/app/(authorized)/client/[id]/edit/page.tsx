"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import CustomerUpdateForm from "@/components/organism/customer-update-form/customer-update-form";
import { fetchClientById, updateCustomer } from "@/utils/api";
import { Client } from "@/types";
import colors from "@/styles/colors";

const ClientEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        const client = await fetchClientById(clientId);
        setClientData(client);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleFormSubmit = async (data: {
    customerName: string;
    email: string;
    nicNumber: string;
    telephoneNumber: string;
    address: string;
    photo: File | null;
  }) => {
    if (!clientData) return;

    try {
      const [firstName, ...lastNameParts] = data.customerName.split(" ");
      const lastName = lastNameParts.join(" ");

      await updateCustomer(clientData.customerId, {
        firstName,
        lastName,
        email: data.email,
        phoneNumber: data.telephoneNumber,
        address: data.address,
        nic: data.nicNumber,
      });

      console.log("Customer updated successfully");
      router.push(`/client/${clientId}`);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
        </div>
      </div>
    );
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
    );
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
          ></h1>
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
        <h2 className="text-lg font-bold text-neutral-600 mb-6">
          Edit Customer Details
        </h2>

        {/* Customer Update Form */}
        <div className="flex justify-center">
          <CustomerUpdateForm
            initialData={{
              customerName: `${clientData.firstName} ${clientData.lastName}`,
              email: clientData.email,
              nicNumber: clientData.nic || "",
              telephoneNumber: clientData.phoneNumber,
              address: clientData.address || "",
              photo: null,
            }}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientEditPage;
