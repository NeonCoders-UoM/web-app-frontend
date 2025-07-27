"use client";

import { useState } from "react";
import Sidebar from "@/components/molecules/side-bar/side-bar";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Button from "@/components/atoms/button/button";
import { Plus } from "lucide-react";
import Table from "@/components/organism/table/table";
import { fetchDashboardStats, fetchServiceCenters, checkAllServiceCentersAvailability, fetchUsers } from "@/utils/api";
import { ServiceCenter, DashboardStats, User } from "@/types";
import { useEffect } from "react";
import axiosInstance from "@/utils/axios";
import StatusCard from "@/components/atoms/status-cards/status-card";
import { useRouter } from "next/navigation";
import ClientTable from "@/components/organism/client-table/client-table";

const AdminDashboard = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [availabilityMap, setAvailabilityMap] = useState<Map<string, { isAvailable: boolean; reason?: string }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userFilter, setUserFilter] = useState("All Users");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, serviceCentersData, availabilityData] = await Promise.all([
          fetchDashboardStats(),
          fetchServiceCenters(),
          checkAllServiceCentersAvailability(),
        ]);
        setStats(statsData);
        setServiceCenters(serviceCentersData);
        setAvailabilityMap(availabilityData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedTab === "users") {
      setIsLoadingUsers(true);
      fetchUsers()
        .then((users) => setUsersData(users))
        .catch((error) => console.error("Error fetching users:", error))
        .finally(() => setIsLoadingUsers(false));
    }
  }, [selectedTab]);

  // Dashboard table logic
  const data = serviceCenters.map((sc) => {
    const availability = availabilityMap.get(sc.id);
    const availabilityStatus = availability?.isAvailable ? "🟢 Available" : "🔴 Closed";
    const reason = availability?.reason ? ` (${availability.reason})` : "";
    return [
      sc.id,
      sc.serviceCenterName,
      sc.email,
      sc.telephoneNumber,
      sc.address,
      availabilityStatus + reason,
    ];
  });
  const headers = [
    { title: "ID", sortable: false },
    { title: "Name", sortable: false },
    { title: "Email", sortable: false },
    { title: "Phone", sortable: false },
    { title: "Address", sortable: false },
    { title: "Availability", sortable: false },
  ];
  const actions = ["edit", "delete", "view"];

  // User management table logic
  const userTableHeaders = [
    { title: "ID", sortable: true },
    { title: "First Name", sortable: true },
    { title: "Last Name", sortable: true },
    { title: "Email", sortable: true },
    { title: "User Role", sortable: true },
  ];
  const handleUserActionSelect = async (action: string, userId: string) => {
    if (action === "Edit" || action === "edit") {
      router.push(`/user-managment/edit/${userId}`);
    } else if (action === "Delete" || action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmDelete) return;
      try {
        await axiosInstance.delete(`/Admin/${userId}`);
        alert("User deleted successfully!");
        setUsersData((prev) => prev.filter((u) => u.userId !== parseInt(userId, 10)));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        role="admin"
        serviceCenters={[]}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {/* Main Content */}
      <div className="flex-1 ml-72">
        <div className="max-w-7xl w-full mx-auto px-6 ">
          <div className="flex justify-end mb-[32px]">
            <UserProfileCard
              pictureSrc="/images/profipic.jpg"
              pictureAlt="User Profile"
              useCurrentUser={true}
              onLogout={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            />
          </div>
          {selectedTab === "dashboard" && (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-12 drop-shadow-sm">
                Dashboard
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-16 mb-16">
                <StatusCard
                  title="Customers"
                  value={stats?.customers || 0}
                  icon="customers"
                />
                <StatusCard
                  title="Vehicles"
                  value={stats?.vehicles || 0}
                  icon="vehicles"
                />
                <StatusCard
                  title="Service Centers"
                  value={stats?.serviceCenters || 0}
                  icon="serviceCenters"
                />
              </div>
              <div className="bg-gradient-to-br from-white/90 via-blue-50/20 to-indigo-50/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/70 p-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <div className="w-2 h-12 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 rounded-full mr-6 shadow-lg"></div>
                    Service Centers
                  </h2>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      variant="primary"
                      size="medium"
                      onClick={() => router.push("/service-centers/add")}
                    >
                      <span className="flex items-center">
                        <Plus size={16} className="mr-2" />
                        Add Service Center
                      </span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="medium"
                      onClick={() => router.push("/services")}
                    >
                      Manage Services
                    </Button>
                    <Button
                      variant="secondary"
                      size="medium"
                      onClick={() => router.push("/packages")}
                    >
                      Manage Packages
                    </Button>
                  </div>
                </div>
                <Table
                  headers={headers}
                  data={data}
                  actions={actions}
                  showSearchBar={false}
                  onAction={() => {}}
                />
              </div>
            </>
          )}
          {selectedTab === "users" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-lg font-bold text-neutral-600">User List</h1>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => router.push("/user-managment/add-user")}
                  icon="PlusIcon"
                  iconPosition="left"
                >
                  Create User
                </Button>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-neutral-200 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <option value="All Users">All Users</option>
                    <option value="Admin">Admin</option>
                    <option value="Service Staff">Service Staff</option>
                    <option value="Data Operator">Data Operator</option>
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
              {isLoadingUsers ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
                </div>
              ) : (
                <ClientTable
                  headers={userTableHeaders}
                  data={usersData.map((u) => ({
                    id: u.userId.toString(),
                    firstname: u.firstName,
                    lastname: u.lastName,
                    email: u.email,
                    userrole: u.role,
                  }))}
                  actions={["edit", "delete"]}
                  showSearchBar={true}
                  showClientCell={true}
                  onActionSelect={handleUserActionSelect}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
