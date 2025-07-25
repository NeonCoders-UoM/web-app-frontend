"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import StatusCard from "@/components/atoms/status-cards/status-card";
import Table from "@/components/organism/table/table";
import Button from "@/components/atoms/button/button";
import UserProfileCard from "@/components/molecules/user-card/user-card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchDashboardStats, fetchServiceCenters } from "@/utils/api";

const AdminDashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    customers: 0,
    vehicles: 0,
    serviceCenters: 0,
  });
  const [serviceCenters, setServiceCenters] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const stats = await fetchDashboardStats();
        const centers = await fetchServiceCenters();
        setDashboardData(stats);
        setServiceCenters(
          centers.map((sc) => [
            sc.id,
            sc.serviceCenterName,
            sc.email,
            sc.telephoneNumber,
            sc.address,
          ])
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tableHeaders = [
    { title: "Id", sortable: true },
    { title: "Name", sortable: true },
    { title: "Email", sortable: true },
    { title: "Phone No.", sortable: true },
    { title: "Address", sortable: true },
  ];

  const handleServiceCenterClick = (serviceCenterId: string) => {
    router.push(`/service-center-dashboard/${serviceCenterId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto w-full">
        {/* Header with logo and user profile */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center">
            <Image
              src="/images/logo3.png"
              alt="Logo"
              width={100}
              height={20}
              className="object-contain"
            />
          </div>
          <div className="w-auto">
            <UserProfileCard />
          </div>
        </div>

        <div className="px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40">
          <h1 className="text-4xl font-bold text-gray-800 mb-12 drop-shadow-sm">
            Dashboard
          </h1>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-16 mb-16">
            <StatusCard
              title="Customers"
              value={dashboardData.customers}
              icon="customers"
            />
            <StatusCard
              title="Vehicles"
              value={dashboardData.vehicles}
              icon="vehicles"
            />
            <StatusCard
              title="Appointments"
              value={dashboardData.serviceCenters}
              icon="serviceCenters"
            />
          </div>

          {/* Service Centers Section */}
          <div className="bg-gradient-to-br from-white/90 via-blue-50/20 to-indigo-50/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/70 p-12">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-[32px]">
              Service Centers
            </h2>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-neutral-150 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary-100"
                  defaultValue="all"
                  suppressHydrationWarning
                >
                  <option value="all">All Service Centers</option>
                  <option value="active">Active Centers</option>
                  <option value="inactive">Inactive Centers</option>
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

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="medium"
                  icon="PlusIcon"
                  iconPosition="left"
                >
                  <span className="flex items-center">
                    Add Service Center
                  </span>
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            {/*<div className="flex gap-4 mb-[32px]">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-neutral-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, type, brand or others..."
                  className="pl-10 pr-4 py-2.5 w-full border border-neutral-150 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  suppressHydrationWarning
                />
              </div>
              <button
                className="px-4 py-2 border border-neutral-150 rounded-md flex items-center gap-2 text-neutral-400"
                suppressHydrationWarning
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
            </div>*/}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-white/80 overflow-hidden">
                <Table
                  headers={tableHeaders}
                  data={serviceCenters}
                  actions={["view", "edit", "delete"]}
                  showSearchBar={true}
                  onServiceCenterClick={handleServiceCenterClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
