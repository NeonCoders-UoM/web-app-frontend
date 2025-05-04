"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Car } from "lucide-react";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import ProfileCard from "@/components/molecules/client-card/client-card";
import AvailablePointsCard from "@/components/molecules/available-points-card/available-points-card";
import TabNavigation from "@/components/atoms/tab-navigation/tab-navigation";
import VehicleDetails from "@/components/molecules/vehicle-details/vehicle-details";
import Button from "@/components/atoms/button/button";
import OrdersTable from "@/components/organism/service-history-table/service-history-table";
import { AppointmentCard } from "@/components/atoms/appointment-details/appointment-details"; // Updated import
import { fetchClientById } from "@/utils/api";
import { Client } from "@/types";

const ClientProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [activeTab, setActiveTab] = useState(1);
  const [activeView, setActiveView] = useState<"serviceHistory" | "appointments">("serviceHistory");
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        const normalizedId = `#CLI-00${clientId.split('-')[1]}`; // Convert "client-1" to "#CLI-0001"
        const client = await fetchClientById(normalizedId);
        setClientData(client);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleEditDetails = () => {
    const vehicleId = clientData?.vehicles?.[activeTab - 1]?.id;
    router.push(`/vehicle/edit/${vehicleId}`);
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

  const activeVehicle = clientData.vehicles?.[activeTab - 1];

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
            pictureAlt={clientData.client}
            name={clientData.client}
            email={clientData.email}
            nic={clientData.nic || ""}
            phone={clientData.phoneno}
            address={clientData.address}
          />
          <AvailablePointsCard points={clientData.points || 0} tiers={clientData.tiers || []} />
        </div>

        {/* Vehicle Tabs and Details */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 mb-6">
          <div className="border-b border-neutral-100 p-2">
            <TabNavigation
              tabs={(clientData.vehicles || []).map((vehicle, index) => ({
                label: `Vehicle ${index + 1}`,
                icon: <Car size={16} />,
              }))}
              activeTab={`Vehicle ${activeTab}`}
              onTabChange={(label) => {
                const index = Number.parseInt(label.replace("Vehicle ", ""));
                setActiveTab(index);
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
            size="medium"
            onClick={() => setActiveView("serviceHistory")}
            className={activeView !== "serviceHistory" ? "bg-white text-primary-200 border border-primary-200" : ""}
          >
            Service History
          </Button>
          <Button
            variant={activeView === "appointments" ? "primary" : "primary"}
            size="medium"
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
            <OrdersTable orders={clientData.serviceHistory || []} showSearchBar={true} />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-neutral-600 mb-4">Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(clientData.appointments || []).map((appointment) => (
                <AppointmentCard
                  key={appointment.appointmentId}
                  appointmentNo={appointment.appointmentId}
                  date={appointment.date}
                  serviceCenter={appointment.serviceCenter}
                  serviceType={appointment.services}
                  additionalNotes="-"
                  fee="500"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfilePage;