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
import {
  fetchClientById,
  fetchVehicleServiceHistory,
  ServiceHistoryDTO,
} from "@/utils/api";
import { Client } from "@/types";

const ClientProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const [activeTab, setActiveTab] = useState(1);
  const [activeView, setActiveView] = useState<
    "serviceHistory" | "appointments"
  >("serviceHistory");
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryDTO[]>([]);
  const [isLoadingServiceHistory, setIsLoadingServiceHistory] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        // Use the clientId directly since fetchClientById now handles both formats
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

  // Fetch service history when active vehicle changes
  useEffect(() => {
    const fetchServiceHistoryData = async () => {
      if (!clientData?.vehicles?.[activeTab - 1]?.id) return;

      setIsLoadingServiceHistory(true);
      try {
        const vehicleId = clientData.vehicles[activeTab - 1].id;
        const history = await fetchVehicleServiceHistory(vehicleId);
        setServiceHistory(history);
      } catch (error) {
        console.error("Error fetching service history:", error);
        setServiceHistory([]);
      } finally {
        setIsLoadingServiceHistory(false);
      }
    };

    if (clientData && activeView === "serviceHistory") {
      fetchServiceHistoryData();
    }
  }, [clientData, activeTab, activeView]);

  // Function to refresh service history (useful for future enhancements)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refreshServiceHistory = async () => {
    if (!clientData?.vehicles?.[activeTab - 1]?.id) return;

    setIsLoadingServiceHistory(true);
    try {
      const vehicleId = clientData.vehicles[activeTab - 1].id;
      const history = await fetchVehicleServiceHistory(vehicleId);
      setServiceHistory(history);
    } catch (error) {
      console.error("Error refreshing service history:", error);
    } finally {
      setIsLoadingServiceHistory(false);
    }
  };

  const handleEditDetails = () => {
    const vehicleId = clientData?.vehicles?.[activeTab - 1]?.id;
    if (vehicleId) {
      router.push(`/vehicle/edit/${vehicleId}`);
    } else {
      console.warn("No vehicle ID found for editing");
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

  const activeVehicle = clientData.vehicles?.[activeTab - 1];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-600">
            Client Profile
          </h1>
          <UserProfileCard
            pictureSrc="/images/profipic.jpg"
            pictureAlt="User Profile"
            useCurrentUser={true}
            onLogout={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          />
        </div>

        {/* Client Profile and Points Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <ProfileCard
            pictureSrc={
              clientData.profilePicture ||
              "https://placehold.co/80x80/svg?text=Client"
            }
            pictureAlt={
              clientData.client ||
              `${clientData.firstName} ${clientData.lastName}`
            }
            name={
              clientData.client ||
              `${clientData.firstName} ${clientData.lastName}`
            }
            email={clientData.email}
            nic={clientData.nic || ""}
            phone={clientData.phoneno || clientData.phoneNumber}
            address={clientData.address || ""}
          />
          <AvailablePointsCard
            points={clientData.points || clientData.loyaltyPoints || 0}
            tiers={clientData.tiers || []}
          />
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
              vin={activeVehicle.vin || activeVehicle.chassisNumber || "N/A"}
              vehicleModel={activeVehicle.model}
              year={activeVehicle.year}
              fuelType={activeVehicle.fuelType || activeVehicle.fuel || "N/A"}
              licensePlate={
                activeVehicle.licensePlate ||
                activeVehicle.registrationNumber ||
                "N/A"
              }
              transmission={activeVehicle.transmission || "Manual"}
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
            className={
              activeView !== "serviceHistory"
                ? "bg-white text-primary-200 border border-primary-200"
                : ""
            }
          >
            Service History
          </Button>
          
        </div>

        {/* Service History or Appointments View */}
        {activeView === "serviceHistory" ? (
          <div>
            <h2 className="text-xl font-semibold text-neutral-600 mb-4">
              Service History
              {activeVehicle && (
                <span className="text-sm text-neutral-500 ml-2">
                  - {activeVehicle.brand} {activeVehicle.model} (
                  {activeVehicle.licensePlate})
                </span>
              )}
            </h2>
            {isLoadingServiceHistory ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-200"></div>
              </div>
            ) : (
              <OrdersTable
                orders={serviceHistory.map((history) => ({
                  id: history.serviceHistoryId.toString(),
                  title: history.serviceType,
                  price: history.cost,
                  originalPrice: history.cost, // No discount concept in backend
                  type: history.isVerified ? "Verified" : "External",
                  date: new Date(history.serviceDate).toLocaleDateString(),
                  serviceCenter:
                    history.serviceCenterName ||
                    history.externalServiceCenterName ||
                    "Unknown",
                  status: "Completed" as const, // All service history is completed
                  image: "/images/default.avif", // Default image
                }))}
                showSearchBar={true}
              />
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-neutral-600 mb-4">
              Appointments
            </h2>
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
